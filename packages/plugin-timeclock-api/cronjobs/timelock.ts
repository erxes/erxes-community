import { IModels } from '../src/connectionResolver';
import { sendCoreMessage, sendFormsMessage } from '../src/messageBroker';
import { ITimeClock } from '../src/models/definitions/timeclock';
import * as mysql from 'mysql2';
import { IUserDocument } from '@erxes/api-utils/src/types';
import * as dayjs from 'dayjs';

const findUserByEmployeeId = async (subdomain: string, empId: number) => {
  const field = await sendFormsMessage({
    subdomain,
    action: 'fields.findOne',
    data: {
      query: {
        code: 'employeeId'
      }
    },
    isRPC: true
  });

  let user: IUserDocument;

  if (field) {
    user = await sendCoreMessage({
      subdomain,
      action: 'users.findOne',
      data: {
        customFieldsData: { $elemMatch: { field: field._id, value: empId } }
      },
      isRPC: true
    });

    return user;
  } else {
    return null;
  }
};

export const connectAndImportFromMysql = async (
  subdomain: string,
  models: IModels
) => {
  // create the connection to database
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'nandi',
    password: 'password',
    database: 'testt'
  });

  connection.connect(err => {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
  });

  connection.query(
    'select * from `dbo.attLog` order by ID, authDateTime limit 200',
    (error, results, fields) => {
      if (error) {
        throw new Error(`error: ${error}`);
      }

      importDataAndCreateTimeclock(subdomain, models, results);
    }
  );
};

const importDataAndCreateTimeclock = async (
  subdomain: string,
  models: IModels,
  queryData: any
) => {
  const returnData: ITimeClock[] = [];

  let currentEmpId = -9999999999;
  let currentEmpData: any;

  for (const queryRow of queryData) {
    const empId = queryRow.ID;
    if (empId === currentEmpId) {
      continue;
    } else {
      currentEmpId = empId;

      // if given employee id is number, extract all employee timeclock data
      const empIdNumber = parseInt(empId, 10);
      if (empIdNumber) {
        currentEmpData = queryData.filter(row => row.ID === currentEmpId);

        returnData.push(
          ...(await createUserTimeclock(
            subdomain,
            models,
            empIdNumber,
            queryRow.employeeName,
            currentEmpData
          ))
        );
      }
    }
  }

  for (const timeclock of returnData) {
    await models.Timeclocks.createTimeClock({ ...timeclock });
  }
};

const createUserTimeclock = async (
  subdomain: string,
  models: IModels,
  empId: number,
  empName: string,
  empData: any
) => {
  const returnUserData: ITimeClock[] = [];

  const user = await findUserByEmployeeId(subdomain, empId);

  // // find if there's any unfinished shift from timeclock data
  // const unfinishedShifts = await models?.Timeclocks.find({
  //   shiftActive: true,
  //   userId: user && user._id,
  //   deviceType: { $ne: 'faceTerminal' }
  // });

  // // if there's an unfinished shift clocked in on XOS
  // for (const unfinishedShift of unfinishedShifts) {
  //   const getShiftStart = dayjs(unfinishedShift.shiftStart);

  //   const getShiftIdx = empData.findIndex(
  //     row =>
  //       dayjs(row.authDateTime) > getShiftStart &&
  //       dayjs(row.authDateTime) < getShiftStart.add(10, 'hour')
  //   );

  //   if (getShiftIdx !== -1) {
  //     await models.Timeclocks.updateTimeClock(unfinishedShift._id, {
  //       userId: user?._id,
  //       shiftStart: unfinishedShift.shiftStart,
  //       shiftEnd: new Date(empData[getShiftIdx].authDateTime),
  //       shiftActive: false
  //     });

  //     // remove that shift from emp Data
  //     empData.splice(getShiftIdx, 1);
  //   }
  // }

  for (let i = 0; i < empData.length; i++) {
    const currShiftStart = empData[i].authDateTime;
    // consider shift end as 10 mins after shift start
    const getShiftEndIdx = empData.findIndex(
      row =>
        dayjs(row.authDateTime) > dayjs(currShiftStart).add(10, 'minute') &&
        dayjs(row.authDateTime) < dayjs(currShiftStart).add(16, 'hour')
    );

    // if no shift end is found, shift is stilll active
    if (getShiftEndIdx === -1) {
      const newTimeclock = {
        shiftStart: new Date(currShiftStart),
        userId: user?._id,
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
      shiftStart: new Date(currShiftStart),
      shiftEnd: new Date(currShiftEnd),
      userId: user?._id,
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
    console.log(findExistingTimeclock);
    alreadyExists = true;
  }

  return alreadyExists;
};
