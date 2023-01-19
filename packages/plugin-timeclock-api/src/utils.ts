import { generateModels, IModels } from './connectionResolver';
import { sendCoreMessage } from './messageBroker';
import { ITimeClock, ITimeClockDocument } from './models/definitions/timeclock';
import * as dayjs from 'dayjs';
import { fixDate, getEnv } from '@erxes/api-utils/src';
import { Sequelize, QueryTypes } from 'sequelize';
import { findBranch, findDepartment } from './graphql/resolvers/utils';

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm';

const findAllTeamMembersWithEmpId = async (subdomain: string) => {
  const users = await sendCoreMessage({
    subdomain,
    action: 'users.find',
    data: {
      query: { employeeId: { $exists: true } }
    },
    isRPC: true,
    defaultValue: []
  });

  return users;
};

const connectAndQueryFromMySql = async (
  subdomain: string,
  startDate: string,
  endDate: string
) => {
  const MYSQL_HOST = getEnv({ name: 'MYSQL_HOST' });
  const MYSQL_DB = getEnv({ name: 'MYSQL_DB' });
  const MYSQL_USERNAME = getEnv({ name: 'MYSQL_USERNAME' });
  const MYSQL_PASSWORD = getEnv({ name: 'MYSQL_PASSWORD' });
  const MYSQL_TABLE = getEnv({ name: 'MYSQL_TABLE' });

  // create connection
  const sequelize = new Sequelize(MYSQL_DB, MYSQL_USERNAME, MYSQL_PASSWORD, {
    host: MYSQL_HOST,
    port: 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        useUTC: false,
        cryptoCredentialsDetails: {
          minVersion: 'TLSv1'
        }
      }
    }
  });

  // find team members with employee Id
  const teamMembers = await findAllTeamMembersWithEmpId(subdomain);

  let returnData;

  sequelize
    .authenticate()
    .then(async () => {
      console.log('Connected to MSSQL');
    })
    .catch(err => {
      console.error(err);
      return err;
    });

  // query by employee Id
  try {
    const teamMembersObject = {};
    const teamMemberIdsArr: any = [];
    for (const teamMember of teamMembers) {
      if (!teamMember.employeeId) {
        continue;
      }
      teamMembersObject[teamMember.employeeId] = teamMember._id;
      teamMemberIdsArr.push(teamMember.employeeId);
    }

    const teamEmployeeIds = teamMemberIdsArr.join(',');

    const query = `SELECT * FROM ${MYSQL_TABLE} WHERE authDateTime >= '${startDate}' AND authDateTime <= '${endDate}' AND ISNUMERIC(ID)=1 AND ID IN (${teamEmployeeIds}) ORDER BY ID, authDateTime`;

    const queryData = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    returnData = await importDataAndCreateTimeclock(
      subdomain,
      queryData,
      teamMembersObject
    );
  } catch (err) {
    console.error(err);
    return err;
  }

  return returnData;
};

const importDataAndCreateTimeclock = async (
  subdomain: string,
  queryData: any,
  teamMembersObj: any
) => {
  const returnData: ITimeClock[] = [];
  const models: IModels = await generateModels(subdomain);
  let currentEmpId = -9999999999;
  let currentEmpTimeData: any;

  for (const queryRow of queryData) {
    const empId = queryRow.ID;
    if (empId === currentEmpId) {
      continue;
    } else {
      currentEmpId = empId;

      // if given employee id is number, extract all timeclock data of an employee
      const empIdNumber = parseInt(empId, 10);
      if (empIdNumber) {
        currentEmpTimeData = queryData.filter(row => row.ID === currentEmpId);

        returnData.push(
          ...(await createUserTimeclock(
            models,
            currentEmpTimeData,
            empIdNumber,
            teamMembersObj
          ))
        );
      }
    }
  }

  return await models.Timeclocks.insertMany(returnData);
};

const createUserTimeclock = async (
  models: IModels,
  empData: any,
  empId: number,
  teamMembersObj: any
) => {
  const returnUserData: ITimeClock[] = [];

  const empSchedulesDict: any = {};
  const empSchedules = await models.Schedules.find({
    userId: teamMembersObj[empId]
  });

  for (const empSchedule of empSchedules) {
    const scheduleShifts = await models.Shifts.find({
      scheduleId: empSchedule._id
    });

    for (const scheduleShift of scheduleShifts) {
      const shift_date_key = dayjs(scheduleShift.shiftStart).format(dateFormat);

      // if schedule has config
      if (empSchedule.scheduleConfigId) {
        empSchedulesDict[shift_date_key] = await models.Shifts.findOne({
          scheduleConfigId: empSchedule.scheduleConfigId
        });
      }
      // else compare with schedule shift start, shift end
      else {
        if (!empSchedulesDict[shift_date_key]) {
          empSchedulesDict[shift_date_key] = {
            noScheduleConfig: {
              configShiftStart: dayjs(scheduleShift.shiftStart).format(
                timeFormat
              ),
              configShiftEnd: dayjs(scheduleShift.shiftEnd).format(timeFormat)
            }
          };
          continue;
        }

        const configShiftStart =
          empSchedulesDict[shift_date_key].noScheduleConfig.configShiftStart;

        const configShiftEnd =
          empSchedulesDict[shift_date_key].noScheduleConfig.configShiftEnd;

        empSchedulesDict[shift_date_key].noScheduleConfig.configShiftStart = [
          configShiftStart,
          dayjs(scheduleShift.shiftStart).format(timeFormat)
        ];

        empSchedulesDict[shift_date_key].noScheduleConfig.configShiftEnd = [
          configShiftEnd,
          dayjs(scheduleShift.shiftStart).format(timeFormat)
        ];
      }
    }
  }

  // find if there're any unfinished shifts, update them
  const unfinishedShiftsArr = await findUnfinishedShifts(
    models,
    teamMembersObj[empId],
    empId,
    empData
  );

  if (unfinishedShiftsArr.length) {
    for (const unfinishedShiftInfo of unfinishedShiftsArr) {
      const getShiftEnd = dayjs(
        empData[unfinishedShiftInfo.endIdxFromEmpData].authDateTime
      ).toDate();

      //     await models.Timeclocks.updateTimeClock(unfinishedShift._id, {
      //       userId: teamMembersObj[empId],
      //       employeeId: empId,
      //       shiftStart: unfinishedShift.shiftStart,
      //       shiftEnd: dayjs(empData[latestShiftIdx].authDateTime).toDate(),
      //       shiftActive: false
      //     });

      console.log(unfinishedShiftInfo.unfinishedTimeclock);

      await models.Timeclocks.updateTimeClock(
        unfinishedShiftInfo.unfinishedTimeclock._id,
        {
          userId: unfinishedShiftInfo.unfinishedTimeclock.userId,
          employeeId: unfinishedShiftInfo.unfinishedTimeclock.employeeId,
          shiftStart: unfinishedShiftInfo.unfinishedTimeclock.shiftStart,
          shiftEnd: getShiftEnd,
          shiftActive: false
        }
      );

      // take out time clocks for unfinished shift frome empData
      empData.splice(
        unfinishedShiftInfo.startIdxFromEmpData,
        unfinishedShiftInfo.endIdxFromEmpData
      );
    }
  }

  // filter emp data, get First In, Last Out time
  for (let i = 0; i < empData.length; i++) {
    const currShiftStart = empData[i].authDateTime;
    // consider shift end as 10 mins after shift start
    const getShiftEndIdx = empData.findIndex(
      row =>
        dayjs(row.authDateTime) > dayjs(currShiftStart).add(10, 'minute') &&
        dayjs(row.authDateTime) <= dayjs(currShiftStart).add(16, 'hour')
    );

    // if no shift end is found, shift is stilll active
    if (getShiftEndIdx === -1) {
      const newTimeclock = {
        shiftStart: dayjs(currShiftStart).toDate(),
        userId: teamMembersObj[empId],
        employeeId: empId,
        deviceName: empData[i].deviceName,
        shiftActive: true,
        deviceType: 'faceTerminal'
      };

      if (!(await checkTimeClockAlreadyExists(newTimeclock, models))) {
        returnUserData.push(newTimeclock);
      }
      continue;
    }

    let currShiftEnd = empData[getShiftEndIdx].authDateTime;

    // get reverse array
    const reverseEmpData = empData.slice().reverse();

    // find the latest time for shift end
    const findLatestShiftEndIdx = reverseEmpData.findIndex(
      row => dayjs(row.authDateTime) < dayjs(currShiftEnd).add(30, 'minute')
    );

    i = empData.length - 1 - findLatestShiftEndIdx;
    currShiftEnd = empData[i].authDateTime;

    const newTimeclockData = {
      shiftStart: dayjs(currShiftStart).toDate(),
      shiftEnd: dayjs(currShiftEnd).toDate(),
      deviceName: empData[getShiftEndIdx].deviceName || undefined,
      userId: teamMembersObj[empId],
      employeeId: empId,
      shiftActive: false,
      deviceType: 'faceTerminal'
    };

    if (!(await checkTimeClockAlreadyExists(newTimeclockData, models))) {
      returnUserData.push(newTimeclockData);
    }
  }

  return returnUserData;
};

const checkValidCheckInValidCheckout = async (
  models: IModels,
  userId: string,
  emScheduleDict: any,
  shiftStart?,
  shiftEnd?
) => {};

const findUnfinishedShifts = async (
  models: IModels,
  userId: string,
  empId: number,
  newEmpData: any
) => {
  // find unfinished shifts
  const unfinishedShifts = await models?.Timeclocks.find({
    shiftActive: true,
    userId: `${userId}`
  });

  type UnfinishedShift = {
    unfinishedTimeclock: ITimeClockDocument;
    startIdxFromEmpData: number;
    endIdxFromEmpData: number;
  };

  const unfinishedShiftsArr: UnfinishedShift[] = [];

  for (const unfinishedShift of unfinishedShifts) {
    const shiftStart = unfinishedShift.shiftStart;
    const getShiftStart = dayjs(shiftStart);

    const overnightShift =
      getShiftStart > dayjs(shiftStart.toLocaleDateString() + ' 21:00:00');

    // if shift starts after 20:00, look for shift end from next day's morning

    const getShiftStartIdx = newEmpData.findIndex(
      row => dayjs(row.authDateTime) >= getShiftStart
    );

    const nextDay = getShiftStart.add(1, 'day').format(dateFormat);
    const currDay = getShiftStart.format(dateFormat);

    // get reverse array
    const reverseEmpData = newEmpData.slice().reverse();
    const getShiftEndFromReverse = reverseEmpData.findIndex(
      row =>
        row.authDate === (overnightShift ? nextDay : currDay) &&
        dayjs(row.authDateTime) < getShiftStart.add(16, 'hour')
    );

    // if shift end is found
    if (getShiftEndFromReverse !== -1) {
      const getShiftEndIdx = newEmpData.length - 1 - getShiftEndFromReverse;

      unfinishedShiftsArr.push({
        unfinishedTimeclock: unfinishedShift,
        startIdxFromEmpData: getShiftStartIdx,
        endIdxFromEmpData: getShiftEndIdx
      });
    }
  }

  return unfinishedShiftsArr;
};

const checkTimeClockAlreadyExists = async (
  userData: ITimeClock,
  models: IModels
) => {
  let alreadyExists = false;

  // check if time log already exists in mongodb
  const existingTimeclocks = await models.Timeclocks.find({
    $or: [
      {
        userId: userData.userId
      },
      {
        employeeUserName: userData.employeeUserName
      },
      { employeeId: userData.employeeId }
    ]
  });

  // find duplicates and not include them in new timeclock data
  const findExistingTimeclock = existingTimeclocks.find(
    existingShift =>
      existingShift.shiftStart.getTime() === userData.shiftStart?.getTime() ||
      existingShift.shiftEnd?.getTime() === userData.shiftEnd?.getTime()
  );

  if (findExistingTimeclock) {
    alreadyExists = true;
  }

  return alreadyExists;
};
const generateFilter = async (params: any, subdomain: string, type: string) => {
  const branchIds = params.branchIds;
  const departmentIds = params.departmentIds;
  const userIds = params.userIds;
  const startDate = params.startDate;
  const endDate = params.endDate;

  const totalUserIds: string[] = await generateCommonUserIds(
    subdomain,
    userIds,
    branchIds,
    departmentIds
  );

  let returnFilter = {};
  let dateGiven: boolean = false;

  const timeFields =
    type === 'schedule'
      ? []
      : type === 'timeclock'
      ? [
          {
            shiftStart:
              startDate && endDate
                ? {
                    $gte: fixDate(startDate),
                    $lte: fixDate(endDate)
                  }
                : startDate
                ? {
                    $gte: fixDate(startDate)
                  }
                : { $lte: fixDate(endDate) }
          },
          {
            shiftEnd:
              startDate && endDate
                ? {
                    $gte: fixDate(startDate),
                    $lte: fixDate(endDate)
                  }
                : startDate
                ? {
                    $gte: fixDate(startDate)
                  }
                : { $lte: fixDate(endDate) }
          }
        ]
      : [
          {
            startTime:
              startDate && endDate
                ? {
                    $gte: fixDate(startDate),
                    $lte: fixDate(endDate)
                  }
                : startDate
                ? {
                    $gte: fixDate(startDate)
                  }
                : { $lte: fixDate(endDate) }
          },
          {
            endTime:
              startDate && endDate
                ? {
                    $gte: fixDate(startDate),
                    $lte: fixDate(endDate)
                  }
                : startDate
                ? {
                    $gte: fixDate(startDate)
                  }
                : { $lte: fixDate(endDate) }
          }
        ];

  if (startDate || endDate) {
    dateGiven = true;
  }

  if (totalUserIds.length > 0) {
    if (dateGiven) {
      returnFilter = {
        $and: [
          { $or: { ...timeFields } },
          { userId: { $in: [...totalUserIds] } }
        ]
      };
    } else {
      returnFilter = { userId: { $in: [...totalUserIds] } };
    }
  }

  if (
    !departmentIds &&
    !branchIds &&
    !userIds &&
    dateGiven &&
    type !== 'schedule'
  ) {
    returnFilter = { $or: timeFields };
  }

  // if no param is given, return empty filter
  return returnFilter;
};

const generateCommonUserIds = async (
  subdomain: string,
  userIds: string[],
  branchIds?: string[],
  departmentIds?: string[]
) => {
  const totalUserIds: string[] = [];
  let commonUser: boolean = false;

  if (branchIds) {
    for (const branchId of branchIds) {
      const branch = await findBranch(subdomain, branchId);
      if (userIds) {
        commonUser = true;
        for (const userId of userIds) {
          if (branch.userIds.includes(userId)) {
            totalUserIds.push(userId);
          }
        }
      } else {
        totalUserIds.push(...branch.userIds);
      }
    }
  }
  if (departmentIds) {
    for (const deptId of departmentIds) {
      const department = await findDepartment(subdomain, deptId);
      if (userIds) {
        commonUser = true;
        for (const userId of userIds) {
          if (department.userIds.includes(userId)) {
            totalUserIds.push(userId);
          }
        }
      } else {
        totalUserIds.push(...department.userIds);
      }
    }
  }

  if (!commonUser && userIds) {
    totalUserIds.push(...userIds);
  }

  return totalUserIds;
};

export {
  connectAndQueryFromMySql,
  generateFilter,
  generateCommonUserIds,
  findAllTeamMembersWithEmpId
};
