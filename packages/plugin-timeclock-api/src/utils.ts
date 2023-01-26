import { generateModels, IModels } from './connectionResolver';
import { sendCoreMessage } from './messageBroker';
import {
  IScheduleDocument,
  ITimeClock,
  ITimeClockDocument
} from './models/definitions/timeclock';
import * as dayjs from 'dayjs';
import { fixDate, getEnv } from '@erxes/api-utils/src';
import { Sequelize, QueryTypes } from 'sequelize';

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm';
import { findBranch, findDepartment } from './graphql/resolvers/utils';

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
  const models: IModels = await generateModels(subdomain);

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
    const teamEmployeeIds: string[] = [];
    const teamMemberIds: string[] = [];

    for (const teamMember of teamMembers) {
      if (!teamMember.employeeId) {
        continue;
      }
      teamMembersObject[teamMember.employeeId] = teamMember._id;
      teamMembersObject[teamMember._id] = teamMember.employeeId;

      teamEmployeeIds.push(teamMember.employeeId);
      teamMemberIds.push(teamMember._id);
    }

    const query = `SELECT * FROM ${MYSQL_TABLE} WHERE authDateTime >= '${startDate}' AND authDateTime <= '${endDate}' AND ISNUMERIC(ID)=1 AND ID IN (${teamEmployeeIds}) ORDER BY ID, authDateTime`;

    const queryData = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    returnData = await importDataAndCreateTimeclock(
      subdomain,
      queryData,
      teamMembersObject,
      teamMemberIds,
      startDate,
      endDate
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
  teamMembersObj: any,
  teamMemberIds: string[],
  startDate: string,
  endDate: string
) => {
  const models: IModels = await generateModels(subdomain);

  const returnData: ITimeClock[] = [];

  const empSchedulesObj = await createScheduleObjOfMembers(
    models,
    teamMemberIds,
    startDate,
    endDate
  );

  const newQueryData = await findAndUpdateUnfinishedShifts(
    models,
    teamMemberIds,
    teamMembersObj,
    queryData,
    empSchedulesObj
  );

  const existingTimeclocks = await models.Timeclocks.find({
    userId: { $in: teamMemberIds }
  });

  for (const teamMemberId of Object.keys(empSchedulesObj)) {
    const currEmployeeId = teamMembersObj[teamMemberId];

    const existingTimeclocksOfEmployee = existingTimeclocks.filter(
      timeclock => timeclock.userId === teamMemberId
    );

    const currentEmpData = newQueryData.filter(
      row => parseFloat(row.ID) === parseFloat(currEmployeeId)
    );

    returnData.push(
      ...(await createUserTimeclock(
        currentEmpData,
        currEmployeeId,
        teamMembersObj,
        empSchedulesObj[teamMembersObj[currEmployeeId]],
        existingTimeclocksOfEmployee
      ))
    );
  }

  return await models.Timeclocks.insertMany(returnData);
};

const createUserTimeclock = async (
  empData: any,
  empId: number,
  teamMembersObj: any,
  empSchedulesObj: any,
  existingTimeclocks: ITimeClockDocument[]
) => {
  const returnUserData: ITimeClock[] = [];

  for (const scheduledDay of Object.keys(empSchedulesObj)) {
    let getShiftStart;
    let getShiftEnd;
    let getLatestTime;
    let checkInStart;
    let checkInEnd;
    let checkOutStart;
    let checkOutEnd;

    // if there's no schedule config, compare with schedules shift start and end
    if (!('validCheckIn' in empSchedulesObj[scheduledDay])) {
      checkInStart = dayjs(
        scheduledDay + ' ' + empSchedulesObj[scheduledDay].shiftStart
      ).add(-3, 'hour');

      checkInEnd = dayjs(
        scheduledDay + ' ' + empSchedulesObj[scheduledDay].shiftStart
      ).add(3, 'hour');
    } else {
      checkInStart = dayjs(
        scheduledDay +
          ' ' +
          empSchedulesObj[scheduledDay].validCheckIn.configShiftStart
      );

      checkInEnd = dayjs(
        scheduledDay +
          ' ' +
          empSchedulesObj[scheduledDay].validCheckIn.configShiftEnd
      );
    }

    const nextDay = dayjs(scheduledDay)
      .add(1, 'day')
      .format(dateFormat);

    const timeLogsOfDay = empData.filter(row => row.authDate === scheduledDay);
    const timeLogsOfNextDay = empData.filter(row => row.authDate === nextDay);

    const getEarliestTime = timeLogsOfDay.find(
      timeLog =>
        dayjs(timeLog.authDateTime) >= checkInStart &&
        dayjs(timeLog.authDateTime) <= checkInEnd
    );

    if (getEarliestTime) {
      getShiftStart = getEarliestTime.authDateTime;
    }

    const overnightShift = empSchedulesObj[scheduledDay].overnight === true;

    if (!('validCheckout' in empSchedulesObj[scheduledDay])) {
      checkOutStart = dayjs(
        overnightShift
          ? nextDay
          : scheduledDay + ' ' + empSchedulesObj[scheduledDay].shiftEnd
      ).add(-3, 'hour');

      checkOutEnd = dayjs(
        overnightShift
          ? nextDay
          : scheduledDay + ' ' + empSchedulesObj[scheduledDay].shiftEnd
      ).add(3, 'hour');
    } else {
      checkOutStart = dayjs(
        overnightShift
          ? nextDay
          : scheduledDay +
              ' ' +
              empSchedulesObj[scheduledDay].validCheckout.configShiftStart
      );

      checkOutEnd = dayjs(
        overnightShift
          ? nextDay
          : scheduledDay +
              ' ' +
              empSchedulesObj[scheduledDay].validCheckout.configShiftEnd
      );
    }

    getLatestTime = overnightShift
      ? timeLogsOfNextDay
      : timeLogsOfDay
          .slice()
          .reverse()
          .find(
            timeLog =>
              dayjs(timeLog.authDateTime) >= checkOutStart &&
              dayjs(timeLog.authDateTime) <= checkOutEnd
          );

    if (getLatestTime) {
      getShiftEnd = getLatestTime.authDateTime;
    }

    if (getShiftStart) {
      // if both shift start and end exist, shift is ended
      if (getShiftEnd) {
        const newTimeclock = {
          shiftStart: getShiftStart,
          shiftEnd: getShiftEnd,
          shiftActive: false,
          userId: teamMembersObj[empId],
          deviceName: getLatestTime.deviceName,
          deviceType: 'faceTerminal'
        };
        if (!checkTimeClockAlreadyExists(newTimeclock, existingTimeclocks)) {
          returnUserData.push(newTimeclock);
        }
        continue;
      }
      // else shift is still active
      const newTime = {
        shiftStart: getShiftStart,
        shiftActive: true,
        userId: teamMembersObj[empId],
        deviceName: getEarliestTime.deviceName,
        deviceType: 'faceTerminal'
      };

      if (!checkTimeClockAlreadyExists(newTime, existingTimeclocks)) {
        returnUserData.push(newTime);
      }
    }
  }

  return returnUserData;
};

const createScheduleObjOfMembers = async (
  models: IModels,
  teamMemberIds: string[],
  startDate: string,
  endDate: string
) => {
  const totalEmployeesSchedulesObject: {
    [userId: string]: IScheduleDocument;
  } = {};

  const totalSchedules = await models.Schedules.find({
    userId: { $in: teamMemberIds }
  });

  const totalScheduleIds = totalSchedules.map(schedule => schedule._id);

  const totalScheduleConfigIds: string[] = [];

  totalSchedules.forEach(schedule => {
    if (schedule.scheduleConfigId) {
      totalScheduleConfigIds.push(schedule.scheduleConfigId);
    }
  });

  const totalScheduleConfigShifts = await models.Shifts.find({
    scheduleConfigId: {
      $in: totalScheduleConfigIds
    }
  });

  const totalScheduleConfigs = await models.ScheduleConfigs.find({
    _id: { $in: [...totalScheduleConfigIds] }
  });

  const totalScheduleShifts = await models.Shifts.find({
    $and: [
      { scheduleId: { $in: totalScheduleIds } },
      {
        shiftStart: {
          $gte: fixDate(startDate),
          $lte: fixDate(endDate)
        },
        shiftEnd: {
          $gte: fixDate(startDate),
          $lte: fixDate(endDate)
        }
      }
    ]
  });

  for (const teamMemberId of teamMemberIds) {
    const empSchedulesDict: any = {};

    const currEmployeeSchedules = totalSchedules.filter(
      schedule => schedule.userId === teamMemberId
    );

    for (const empSchedule of currEmployeeSchedules) {
      const currEmployeeScheduleShifts = totalScheduleShifts.filter(
        scheduleShift => scheduleShift.scheduleId === empSchedule._id
      );

      let currEmpScheduleConfig = {};
      if (empSchedule.scheduleConfigId) {
        const currScheduleConfigs = totalScheduleConfigShifts.filter(
          scheduleConfig =>
            scheduleConfig.scheduleConfigId === empSchedule.scheduleConfigId
        );

        currScheduleConfigs.forEach(scheduleConfig => {
          currEmpScheduleConfig[scheduleConfig.configName || ''] = {
            configShiftStart: scheduleConfig.configShiftStart,
            configShiftEnd: scheduleConfig.configShiftEnd
          };
        });
      }

      for (const scheduleShift of currEmployeeScheduleShifts) {
        const shift_date_key = dayjs(scheduleShift.shiftStart).format(
          dateFormat
        );
        // if schedule has config
        if (empSchedule.scheduleConfigId) {
          const getScheduleConfig = totalScheduleConfigs.find(
            scheduleConfig =>
              scheduleConfig._id === empSchedule.scheduleConfigId
          );

          currEmpScheduleConfig = {
            ...currEmpScheduleConfig,
            shiftStart: getScheduleConfig?.shiftStart,
            shiftEnd: getScheduleConfig?.shiftEnd,
            overnight:
              dayjs(
                new Date().toLocaleDateString() +
                  ' ' +
                  getScheduleConfig?.shiftStart
              ) >
              dayjs(
                new Date().toLocaleDateString() +
                  ' ' +
                  getScheduleConfig?.shiftEnd
              )
          };
          empSchedulesDict[shift_date_key] = currEmpScheduleConfig;
        }
        // else compare with schedule shift start, shift end
        else {
          const getShiftStartTime = dayjs(scheduleShift.shiftStart).format(
            timeFormat
          );

          const getShiftEndTime = dayjs(scheduleShift.shiftEnd).format(
            timeFormat
          );
          empSchedulesDict[shift_date_key] = {
            shiftStart: getShiftStartTime,
            shiftEnd: getShiftEndTime,
            overnight:
              dayjs(new Date().toLocaleDateString() + ' ' + getShiftStartTime) >
              dayjs(new Date().toLocaleDateString() + ' ' + getShiftEndTime)
          };
          continue;
        }
      }
    }

    if (!Object.keys(empSchedulesDict).length) {
      continue;
    }

    totalEmployeesSchedulesObject[teamMemberId] = empSchedulesDict;
  }

  return totalEmployeesSchedulesObject;
};

const findAndUpdateUnfinishedShifts = async (
  models: IModels,
  teamMemberIds: string[],
  teamMembersObj: any,
  empData: any,
  empSchedulesObj: any
) => {
  const newEmpData = empData;

  // find unfinished shifts
  const unfinishedShifts = await models?.Timeclocks.find({
    shiftActive: true,
    userId: { $in: teamMemberIds }
  });

  unfinishedShifts.forEach(async unfinishedShift => {
    let getShiftEndIdx;
    const teamMemberId = unfinishedShift.userId || '';
    const empId = parseInt(teamMembersObj[teamMemberId || ''], 10);

    const shiftStart = unfinishedShift.shiftStart;
    const getShiftStart = dayjs(shiftStart);

    const getShiftDay = getShiftStart.format(dateFormat);
    const getNextDay = getShiftStart.add(1, 'day').format(dateFormat);

    let checkOutStart;
    let checkOutEnd;
    // if there's no schedule config for that shift
    if (
      !(teamMemberId in empSchedulesObj) ||
      !(getShiftDay in empSchedulesObj[teamMemberId])
    ) {
      return;
    }

    const overnightShift =
      empSchedulesObj[teamMemberId][getShiftDay].overnight === true;

    if (!('validCheckout' in empSchedulesObj[teamMemberId][getShiftDay])) {
      checkOutStart = dayjs(
        overnightShift
          ? getNextDay
          : getShiftDay +
              ' ' +
              empSchedulesObj[teamMemberId][getShiftDay].shiftEnd
      ).add(-3, 'hour');

      checkOutEnd = dayjs(
        overnightShift
          ? getNextDay
          : getShiftDay +
              ' ' +
              empSchedulesObj[teamMemberId][getShiftDay].shiftEnd
      ).add(3, 'hour');
    } else {
      checkOutStart = dayjs(
        overnightShift
          ? getNextDay
          : getShiftDay +
              ' ' +
              empSchedulesObj[teamMemberId][getShiftDay].validCheckout
                .configShiftStart
      );

      checkOutEnd = dayjs(
        overnightShift
          ? getNextDay
          : getShiftDay +
              ' ' +
              empSchedulesObj[teamMemberId][getShiftDay].validCheckout
                .configShiftEnd
      );
    }

    const getLatestTimeIdx = newEmpData
      .slice()
      .reverse()
      .findIndex(
        timeLog =>
          parseInt(timeLog.ID, 10) === empId &&
          dayjs(timeLog.authDateTime) >= checkOutStart &&
          dayjs(timeLog.authDateTime) <= checkOutEnd
      );

    const getShiftStartIdx = newEmpData.findIndex(
      row =>
        parseInt(row.ID, 10) === empId &&
        dayjs(row.authDateTime) >= getShiftStart
    );

    // if shift end is found
    if (getLatestTimeIdx !== -1) {
      getShiftEndIdx = newEmpData.length - 1 - getLatestTimeIdx;

      const getShiftEnd = dayjs(
        newEmpData[getShiftEndIdx].authDateTime
      ).toDate();

      const updateTimeClock = {
        shiftStart: unfinishedShift.shiftStart,
        shiftEnd: getShiftEnd,
        userId: teamMemberId,
        shiftActive: false,
        deviceName: newEmpData[getShiftEndIdx].deviceName,
        deviceType: unfinishedShift.deviceType + ' x faceTerminal'
      };

      await models.Timeclocks.updateTimeClock(
        unfinishedShift._id,
        updateTimeClock
      );

      const deleteCount = getShiftEndIdx - getShiftStartIdx + 1;
      newEmpData.splice(getShiftStartIdx, deleteCount);
    }
  });

  return newEmpData;
};

const checkTimeClockAlreadyExists = (
  userData: ITimeClock,
  existingTimeclocks: ITimeClockDocument[]
) => {
  let alreadyExists = false;

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
      returnFilter =
        type === 'schedule'
          ? { userId: { $in: [...totalUserIds] } }
          : {
              $and: [
                { $or: timeFields },
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

const createTeamMembersObject = async (subdomain: string) => {
  const teamMembersWithEmpId = await findAllTeamMembersWithEmpId(subdomain);

  const teamMembersObject = {};

  for (const teamMember of teamMembersWithEmpId) {
    if (!teamMember.employeeId) {
      continue;
    }

    teamMembersObject[teamMember._id] = {
      employeeId: teamMember.employeeId,
      firstName: teamMember.details.firstName,
      lastName: teamMember.details.lastName,
      position: teamMember.details.position
    };
  }

  return teamMembersObject;
};

export {
  connectAndQueryFromMySql,
  generateFilter,
  generateCommonUserIds,
  findAllTeamMembersWithEmpId,
  createTeamMembersObject
};
