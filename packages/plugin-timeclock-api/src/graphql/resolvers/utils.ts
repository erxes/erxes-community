import { generateModels, IModels } from '../../connectionResolver';
import { sendCoreMessage, sendFormsMessage } from '../../messageBroker';
import { ITimeClock, IUserReport } from '../../models/definitions/timeclock';
import * as mysql from 'mysql2';
import { IUserDocument } from '@erxes/api-utils/src/types';
import * as dayjs from 'dayjs';

export const findDepartment = async (subdomain: string, target) => {
  const department = await sendCoreMessage({
    subdomain,
    action: 'departments.findOne',
    data: { _id: target },
    isRPC: true
  });

  return department;
};

export const findBranch = async (subdomain: string, target) => {
  const branch = await sendCoreMessage({
    subdomain,
    action: 'branches.findOne',
    data: { _id: target },
    isRPC: true
  });

  return branch;
};

export const findBranches = async (subdomain: string, userId: string) => {
  const branches = await sendCoreMessage({
    subdomain,
    action: 'branches.find',
    data: { query: { userIds: userId } },
    isRPC: true
  });

  return branches;
};

export const returnReportByUserIds = async (
  models: IModels,
  selectedUserIds: string[]
): Promise<[IUserReport[], number, number, number, number]> => {
  let idx = 0;
  const reports: IUserReport[] = [];

  let groupTotalAbsence = 0;
  let groupTotalMinsWorked = 0;
  let groupTotalMinsScheduled = 0;

  for (const userId of selectedUserIds) {
    const schedules = models.Schedules.find({
      userId: `${userId}`
    });
    const timeclocks = models.Timeclocks.find({
      userId: `${userId}`
    });
    const absences = models.Absences.find({
      userId: `${userId}`,
      status: 'Approved'
    });
    const shiftsOfSchedule: any = [];

    for (const { _id } of await schedules) {
      shiftsOfSchedule.push(
        ...(await models.Shifts.find({
          scheduleId: _id,
          status: 'Approved'
        }))
      );
    }

    // if any of the schemas is not empty
    if (
      (await absences).length !== 0 ||
      (await schedules).length !== 0 ||
      (await timeclocks).length !== 0
    ) {
      reports.push({
        userId: `${userId}`,
        scheduleReport: []
      });

      let totalMinsWorkedPerUser = 0;
      let totalMinsScheduledPerUser = 0;

      for (const timeclock of await timeclocks) {
        const previousSchedules = reports[idx].scheduleReport;

        const shiftDuration =
          timeclock.shiftEnd &&
          timeclock.shiftStart &&
          Math.round(
            (timeclock.shiftEnd.getTime() - timeclock.shiftStart.getTime()) /
              60000
          );

        totalMinsWorkedPerUser += shiftDuration || 0;
        reports[idx] = {
          ...reports[idx],
          scheduleReport: previousSchedules?.concat({
            date: new Date(timeclock.shiftStart).toDateString(),
            recordedStart: timeclock.shiftStart,
            recordedEnd: timeclock.shiftEnd,
            minsWorked: shiftDuration
          })
        };
      }

      for (const scheduleShift of shiftsOfSchedule) {
        let found = false;
        const scheduleDateString = new Date(
          scheduleShift.shiftStart
        ).toDateString();

        // schedule duration per shift
        const scheduleDuration =
          scheduleShift.shiftEnd &&
          scheduleShift.shiftStart &&
          Math.round(
            (scheduleShift.shiftEnd.getTime() -
              scheduleShift.shiftStart.getTime()) /
              60000
          );

        totalMinsScheduledPerUser += scheduleDuration;
        reports[idx].totalMinsScheduled = totalMinsScheduledPerUser;

        reports[idx].scheduleReport.forEach(
          (recordedShiftOfReport, recorded_shiftIdx) => {
            if (recordedShiftOfReport.date === scheduleDateString) {
              reports[idx].scheduleReport[recorded_shiftIdx] = {
                ...recordedShiftOfReport,
                scheduleStart: scheduleShift.shiftStart,
                scheduleEnd: scheduleShift.shiftEnd
              };
              found = true;
            }
          }
        );

        // if corresponding shift is not found from recorded shifts
        if (!found) {
          reports[idx].scheduleReport?.push({
            date: scheduleDateString,
            scheduleStart: scheduleShift.shiftStart,
            scheduleEnd: scheduleShift.shiftEnd
          });
        }
      }

      // calculate total absent mins per user
      let totalAbsencePerUser = 0;
      for (const absence of await absences) {
        if (absence.startTime && absence.endTime) {
          totalAbsencePerUser +=
            (absence.endTime.getTime() - absence.startTime.getTime()) / 60000;
        }
      }
      reports[idx] = {
        ...reports[idx],
        totalAbsenceMins: Math.trunc(totalAbsencePerUser),
        totalMinsWorked: totalMinsWorkedPerUser
      };

      groupTotalMinsScheduled += totalMinsScheduledPerUser;
      groupTotalMinsWorked += totalMinsWorkedPerUser;
      groupTotalAbsence += Math.trunc(totalAbsencePerUser);
      idx += 1;
    }
  }
  let groupTotalMinsLate = 0;

  //  calculate how many mins late per user
  reports.forEach((userReport, groupReportIdx) => {
    let totalMinsLatePerUser = 0;
    userReport.scheduleReport.forEach((userSchedule, userReportIdx) => {
      if (
        userSchedule.recordedEnd &&
        userSchedule.recordedStart &&
        userSchedule.scheduleEnd &&
        userSchedule.scheduleStart
      ) {
        const shiftStartDiff =
          userSchedule.recordedStart.getTime() -
          userSchedule.scheduleStart.getTime();

        const shiftEndDiff =
          userSchedule.scheduleEnd.getTime() -
          userSchedule.recordedEnd.getTime();

        const sumMinsLate = Math.trunc(
          ((shiftEndDiff > 0 ? shiftEndDiff : 0) +
            (shiftStartDiff > 0 ? shiftStartDiff : 0)) /
            60000
        );

        totalMinsLatePerUser += sumMinsLate;
        userReport.scheduleReport[userReportIdx] = {
          ...userSchedule,
          minsLate: sumMinsLate
        };
      }
    });

    groupTotalMinsLate += totalMinsLatePerUser;
    reports[groupReportIdx] = {
      ...userReport,
      totalMinsLate: totalMinsLatePerUser
    };
  });

  return [
    reports,
    groupTotalMinsLate,
    groupTotalAbsence,
    groupTotalMinsWorked,
    groupTotalMinsScheduled
  ];
};

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

export const connectAndImportFromMysql = async (subdomain: string) => {
  const mysqlHost = process.env.MYSQL_HOST;
  const mysqlDB = process.env.MYSQL_DB;
  const mysqlUser = process.env.MYSQL_USERNAME;
  const mysqlPassword = process.env.MYSQL_PASSWORD;
  const mysqlTable = process.env.MYSQL_TABLE;

  // create the connection to database
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'nandi',
    password: 'password',
    database: 'testt'
  });

  let returnTimeclock;
  connection.connect(err => {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
  });

  connection.query(
    'select * from `dbo.attLog` order by ID, authDateTime',
    async (error, results) => {
      if (error) {
        throw new Error(`error: ${error}`);
      }

      returnTimeclock = await importDataAndCreateTimeclock(subdomain, results);
    }
  );

  return returnTimeclock;
};

const importDataAndCreateTimeclock = async (
  subdomain: string,
  queryData: any
) => {
  const returnData: ITimeClock[] = [];
  const models: IModels = await generateModels(subdomain);
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

  await models.Timeclocks.insertMany(returnData);

  return models.Timeclocks.find();
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
    alreadyExists = true;
  }

  return alreadyExists;
};
