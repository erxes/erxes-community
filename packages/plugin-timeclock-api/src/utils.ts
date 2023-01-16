import { generateModels, IModels } from './connectionResolver';
import { sendCoreMessage, sendFormsMessage } from './messageBroker';
import { ITimeClock, IUserReport } from './models/definitions/timeclock';
import * as dayjs from 'dayjs';
import { fixDate, getEnv } from '@erxes/api-utils/src';
import { IUserDocument } from '@erxes/api-utils/src/types';
import { Sequelize, QueryTypes } from 'sequelize';
import { findBranch, findDepartment } from './graphql/resolvers/utils';

const findUserByEmployeeId = async (subdomain: string, empId: string) => {
  let user: IUserDocument;

  if (empId) {
    user = await sendCoreMessage({
      subdomain,
      action: 'users.findOne',
      data: {
        employeeId: empId
      },
      isRPC: true
    });

    return user;
  } else {
    return null;
  }
};

const findAllTeamMembersWithEmpId = async (subdomain: string) => {
  const users = await sendCoreMessage({
    subdomain,
    action: 'users.find',
    data: {
      query: {}
    },
    isRPC: true,
    defaultValue: []
  });

  return users.filter(user => user.employeeId);
};

const connectAndQueryFromMySql = async (subdomain: string) => {
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
    for (const teamMember of teamMembers) {
      const query = `SELECT * FROM ${MYSQL_TABLE} WHERE ISNUMERIC(ID)=1 AND ID = ${teamMember.employeeId} ORDER BY authDateTime`;
      const queryData = await sequelize.query(query, {
        type: QueryTypes.SELECT
      });
      returnData = await importDataAndCreateTimeclock(
        subdomain,
        queryData,
        teamMember
      );
    }
  } catch (err) {
    console.error(err);
    return err;
  }

  return returnData;
};

const importDataAndCreateTimeclock = async (
  subdomain: string,
  queryData: any,
  teamMember: IUserDocument
) => {
  const returnData: ITimeClock[] = [];
  const models: IModels = await generateModels(subdomain);

  returnData.push(
    ...(await createUserTimeclock(subdomain, models, queryData, teamMember))
  );

  return await models.Timeclocks.insertMany(returnData);
};

const createUserTimeclock = async (
  subdomain: string,
  models: IModels,
  empData: any,
  teamMember: IUserDocument
) => {
  const empId = teamMember._id;
  const empName = teamMember.details?.fullName;
  const returnUserData: ITimeClock[] = [];

  // find if there's any unfinished shift from previous timeclock data
  const unfinishedShifts = await models?.Timeclocks.find({
    shiftActive: true,
    employeeId: empId
  });

  for (const unfinishedShift of unfinishedShifts) {
    const getShiftStart = dayjs(unfinishedShift.shiftStart);

    // find the potential shift end, which must be 30 mins later and within 16 hrs from shift start
    const getShiftIdx = empData.findIndex(
      row =>
        dayjs(row.authDateTime) > getShiftStart.add(30, 'minute') &&
        dayjs(row.authDateTime) < getShiftStart.add(16, 'hour')
    );

    if (getShiftIdx !== -1) {
      const potentialShiftEnd = empData[getShiftIdx].authDateTime;

      // get reverse array
      const reverseEmpData = empData.slice().reverse();

      // find the latest time for shift end
      const findLatestShiftEndIdx = reverseEmpData.findIndex(
        row =>
          dayjs(row.authDateTime) < dayjs(potentialShiftEnd).add(30, 'minute')
      );

      const latestShiftIdx = empData.length - 1 - findLatestShiftEndIdx;

      await models.Timeclocks.updateTimeClock(unfinishedShift._id, {
        userId: teamMember?._id,
        employeeId: empId,
        shiftStart: unfinishedShift.shiftStart,
        shiftEnd: dayjs(empData[latestShiftIdx].authDateTime).toDate(),
        shiftActive: false
      });

      // remove those shift(s) from emp Data
      empData.splice(getShiftIdx, latestShiftIdx - getShiftIdx + 1);
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
        userId: teamMember?._id,
        deviceName: empData[i].deviceName,
        employeeUserName: empName || undefined,
        employeeId: empId,
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
      userId: teamMember?._id,
      deviceName: empData[getShiftEndIdx].deviceName || undefined,
      employeeUserName: empName || undefined,
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
const generateFilter = async (params, subdomain, type) => {
  const branchIds = params.branchIds;
  const departmentIds = params.departmentIds;
  const userIds = params.userIds;
  const startDate = params.startDate;
  const endDate = params.endDate;

  const totalUserIds: string[] = [];
  let commonUser: boolean = false;
  let dateGiven: boolean = false;

  let returnFilter = {};

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
        $and: [...timeFields, { userId: { $in: [...totalUserIds] } }]
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

export {
  connectAndQueryFromMySql,
  generateFilter,
  findAllTeamMembersWithEmpId
};
