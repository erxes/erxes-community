import { fixDate } from '@erxes/api-utils/src';
import dayjs = require('dayjs');
import { generateModels, IModels } from '../../connectionResolver';
import { sendCoreMessage } from '../../messageBroker';
import {
  IScheduleDocument,
  IShiftDocument,
  IUserReport,
  IUsersReport
} from '../../models/definitions/timeclock';

// milliseconds to hrs
const MMSTOHRS = 3600000;
// milliseconds to mins
const MMSTOMINS = 60000;

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

export const createScheduleShiftsByUserIds = async (
  userIds: string[],
  shifts,
  models: IModels,
  scheduleConfigId?: string
) => {
  let schedule;
  userIds.forEach(async userId => {
    schedule = await models.Schedules.createSchedule({
      userId: `${userId}`,
      solved: true,
      status: 'Approved',
      scheduleConfigId: `${scheduleConfigId}`
    });

    shifts.forEach(shift => {
      models.Shifts.createShift({
        scheduleId: schedule._id,
        shiftStart: shift.shiftStart,
        shiftEnd: shift.shiftEnd,
        solved: true,
        status: 'Approved'
      });
    });
  });

  return schedule;
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

export const timeclockReportByUser = async (
  userId: string,
  subdomain: string,
  startDate?: string,
  endDate?: string
) => {
  const models = await generateModels(subdomain);

  let report: IUserReport = {
    scheduleReport: [],
    userId: `${userId}`,
    totalMinsScheduledThisMonth: 0
  };
  const shiftsOfSchedule: any = [];

  // get 1st of the next Month
  const NOW = new Date();
  const startOfNextMonth = new Date(NOW.getFullYear(), NOW.getMonth() + 1, 1);
  // get 1st of this month
  const startOfThisMonth = new Date(NOW.getFullYear(), NOW.getMonth(), 1);

  const startTime = startDate ? startDate : startOfThisMonth;
  const endTime = endDate ? endDate : startOfNextMonth;

  // get the schedule data of this month
  const schedules = models.Schedules.find({ userId: `${userId}` });
  const timeclocks = models.Timeclocks.find({
    $and: [
      { userId: `${userId}` },
      {
        shiftStart: {
          $gte: fixDate(startTime),
          $lte: fixDate(endTime)
        }
      },
      {
        shiftEnd: {
          $gte: fixDate(startTime),
          $lte: fixDate(endTime)
        }
      }
    ]
  });
  const absences = models.Absences.find({
    $and: [
      {
        userId: `${userId}`,
        status: 'Approved'
      },
      {
        startTime: {
          $gte: fixDate(startTime),
          $lte: fixDate(endTime)
        }
      }
    ]
  });

  for (const { _id } of await schedules) {
    shiftsOfSchedule.push(
      ...(await models.Shifts.find({
        $and: [
          { scheduleId: _id },
          { status: 'Approved' },
          {
            shiftStart: {
              $gte: fixDate(startTime),
              $lte: fixDate(endTime)
            }
          }
        ]
      }))
    );
  }

  // if any of the schemas is not empty
  if (
    (await absences).length !== 0 ||
    (await schedules).length !== 0 ||
    (await timeclocks).length !== 0
  ) {
    let totalMinsWorkedThisMonthPerUser = 0;
    let totalMinsWorkedTodayPerUser = 0;
    for (const timeclock of await timeclocks) {
      const previousSchedules = report.scheduleReport;

      const shiftDuration =
        timeclock.shiftEnd &&
        timeclock.shiftStart &&
        Math.round(
          (timeclock.shiftEnd.getTime() - timeclock.shiftStart.getTime()) /
            60000
        );

      totalMinsWorkedThisMonthPerUser += shiftDuration || 0;
      if (timeclock.shiftStart.toDateString() === NOW.toDateString()) {
        totalMinsWorkedTodayPerUser += shiftDuration || 0;
        report.totalMinsWorkedToday = totalMinsWorkedTodayPerUser;
      }
      report = {
        ...report,
        scheduleReport: previousSchedules?.concat({
          date: new Date(timeclock.shiftStart).toDateString(),
          recordedStart: timeclock.shiftStart,
          recordedEnd: timeclock.shiftEnd,
          minsWorked: shiftDuration
        })
      };
    }

    const totalDaysWorkedThisMonth = new Set(
      (await timeclocks).map(shift =>
        new Date(shift.shiftStart).toLocaleDateString()
      )
    ).size;

    const totalDaysScheduledThisMonth = new Set(
      shiftsOfSchedule.map(shiftOfSchedule =>
        new Date(shiftOfSchedule.shiftStart).toLocaleDateString()
      )
    ).size;

    report.totalDaysScheduledThisMonth = totalDaysScheduledThisMonth;
    report.totalDaysWorkedThisMonth = totalDaysWorkedThisMonth;

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

      report.totalMinsScheduledThisMonth += scheduleDuration;

      // if today's scheduled time is found
      if (scheduleDateString === NOW.toDateString()) {
        report.totalMinsScheduledToday = scheduleDuration;
      }

      report.scheduleReport.forEach(
        (recordedShiftOfReport, recorded_shiftIdx) => {
          if (recordedShiftOfReport.date === scheduleDateString) {
            recordedShiftOfReport.scheduleStart = scheduleShift.shiftStart;
            recordedShiftOfReport.scheduleEnd = scheduleShift.shiftEnd;
            found = true;
          }
        }
      );

      // if corresponding shift is not found from recorded shifts
      if (!found) {
        report.scheduleReport.push({
          date: scheduleDateString,
          scheduleStart: scheduleShift.shiftStart,
          scheduleEnd: scheduleShift.shiftEnd
        });
      }
    }

    // calculate total absent mins of this month per user
    let totalAbsencePerUser = 0;
    for (const absence of await absences) {
      if (absence.startTime && absence.endTime) {
        totalAbsencePerUser +=
          (absence.endTime.getTime() - absence.startTime.getTime()) / 60000;
      }
    }
    report = {
      ...report,
      totalMinsAbsenceThisMonth: Math.trunc(totalAbsencePerUser),
      totalMinsWorkedThisMonth: totalMinsWorkedThisMonthPerUser
    };
  }

  //  calculate how many mins late per user
  let totalMinsLatePerUser = 0;

  report.scheduleReport.forEach((userSchedule, user_report_idx) => {
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
        userSchedule.scheduleEnd.getTime() - userSchedule.recordedEnd.getTime();

      const sumMinsLate = Math.trunc(
        ((shiftEndDiff > 0 ? shiftEndDiff : 0) +
          (shiftStartDiff > 0 ? shiftStartDiff : 0)) /
          60000
      );

      // if report of today is found
      if (userSchedule.date === NOW.toDateString()) {
        report.totalMinsLateToday = sumMinsLate;
      }
      totalMinsLatePerUser += sumMinsLate;
      report.scheduleReport[user_report_idx].minsLate = sumMinsLate;
    }
  });

  report.totalMinsLateThisMonth = totalMinsLatePerUser;

  return report;
};

export const timeclockReportPreliminary = async (
  subdomain: string,
  userIds: string[],
  startDate: string,
  endDate: string,
  teamMembersObj?: any,
  exportToXlsx?: boolean
) => {
  const models = await generateModels(subdomain);

  const usersReport: IUsersReport = {};
  const shiftsOfSchedule: any = [];

  // get the schedule data of this month
  const schedules = await models.Schedules.find({
    userId: { $in: userIds }
  }).sort({
    userId: 1
  });

  const scheduleIds = schedules.map(schedule => schedule._id);

  const timeclocks = await models.Timeclocks.find({
    $and: [
      { userId: { $in: userIds } },
      {
        shiftStart: {
          $gte: fixDate(startDate),
          $lte: fixDate(endDate)
        }
      },
      {
        shiftEnd: {
          $gte: fixDate(startDate),
          $lte: fixDate(endDate)
        }
      }
    ]
  }).sort({ userId: 1 });

  shiftsOfSchedule.push(
    ...(await models.Shifts.find({
      $and: [
        { scheduleId: { $in: scheduleIds } },
        { status: 'Approved' },
        {
          shiftStart: {
            $gte: fixDate(startDate),
            $lte: fixDate(endDate)
          }
        }
      ]
    }))
  );

  userIds.forEach(async currUserId => {
    // assign team member info from teamMembersObj

    if (exportToXlsx) {
      usersReport[currUserId] = { ...teamMembersObj[currUserId] };
    }

    const currUserTimeclocks = timeclocks.filter(
      timeclock => timeclock.userId === currUserId
    );

    const currUserSchedules = schedules.filter(
      schedule => schedule.userId === currUserId
    );

    // get shifts of schedule
    const currUserScheduleShifts: any = [];
    currUserSchedules.forEach(async userSchedule => {
      currUserScheduleShifts.push(
        ...shiftsOfSchedule.filter(
          scheduleShift => scheduleShift.scheduleId === userSchedule._id
        )
      );
    });

    let totalDaysWorkedPerUser = 0;
    let totalDaysScheduledPerUser = 0;

    if (currUserTimeclocks) {
      totalDaysWorkedPerUser = new Set(
        currUserTimeclocks.map(shift =>
          new Date(shift.shiftStart).toLocaleDateString()
        )
      ).size;
    }
    if (currUserScheduleShifts) {
      totalDaysScheduledPerUser += new Set(
        currUserScheduleShifts.map(shiftOfSchedule =>
          new Date(shiftOfSchedule.shiftStart).toLocaleDateString()
        )
      ).size;
    }

    if (exportToXlsx) {
      usersReport[currUserId].totalDaysScheduled = totalDaysScheduledPerUser;
      usersReport[currUserId].totalDaysWorked = totalDaysWorkedPerUser;
    } else {
      usersReport[currUserId] = {
        totalDaysScheduled: totalDaysScheduledPerUser,
        totalDaysWorked: totalDaysWorkedPerUser
      };
    }
  });

  return usersReport;
};

export const timeclockReportFinal = async (
  subdomain: string,
  userIds: string[],
  startDate?: string,
  endDate?: string,
  teamMembersObj?: any,
  exportToXlsx?: boolean
) => {
  const models = await generateModels(subdomain);
  const usersReport: IUsersReport = {};
  const shiftsOfSchedule: any = [];

  // get the schedule data of this month
  const schedules = await models.Schedules.find({
    userId: { $in: userIds }
  }).sort({
    userId: 1
  });

  const scheduleIds = schedules.map(schedule => schedule._id);

  const timeclocks = await models.Timeclocks.find({
    $and: [
      { userId: { $in: userIds } },
      {
        shiftStart: {
          $gte: fixDate(startDate),
          $lte: fixDate(endDate)
        }
      },
      {
        shiftEnd: {
          $gte: fixDate(startDate),
          $lte: fixDate(endDate)
        }
      }
    ]
  }).sort({ userId: 1 });

  shiftsOfSchedule.push(
    ...(await models.Shifts.find({
      $and: [
        { scheduleId: { $in: scheduleIds } },
        { status: 'Approved' },
        {
          shiftStart: {
            $gte: fixDate(startDate),
            $lte: fixDate(endDate)
          }
        }
      ]
    }))
  );

  const schedulesObj = createSchedulesObj(userIds, schedules, shiftsOfSchedule);

  userIds.forEach(async currUserId => {
    // assign team member info from teamMembersObj

    if (exportToXlsx) {
      usersReport[currUserId] = { ...teamMembersObj[currUserId] };
    }

    const currUserTimeclocks = timeclocks.filter(
      timeclock => timeclock.userId === currUserId
    );

    const currUserSchedules = schedules.filter(
      schedule => schedule.userId === currUserId
    );

    // get shifts of schedule
    const currUserScheduleShifts: any = [];
    currUserSchedules.forEach(userSchedule => {
      currUserScheduleShifts.push(
        ...shiftsOfSchedule.filter(
          scheduleShift => scheduleShift.scheduleId === userSchedule._id
        )
      );
    });

    let totalDaysWorkedPerUser = 0;
    let totalRegularHoursWorkedPerUser = 0;
    let totalHoursWorkedPerUser = 0;

    let totalDaysScheduledPerUser = 0;
    let totalHoursScheduledPerUser = 0;

    let totalHoursOvertimePerUser = 0;
    let totalMinsLatePerUser = 0;
    let totalHoursOvernightPerUser = 0;

    if (currUserTimeclocks) {
      totalDaysWorkedPerUser = new Set(
        currUserTimeclocks.map(shift =>
          new Date(shift.shiftStart).toLocaleDateString()
        )
      ).size;

      currUserTimeclocks.forEach(currUserTimeclock => {
        const shiftStart = currUserTimeclock.shiftStart;
        const shiftEnd = currUserTimeclock.shiftEnd;
        if (shiftStart && shiftEnd) {
          // get time in hours
          const totalHoursWorkedPerShift =
            (shiftEnd.getTime() - shiftStart.getTime()) / MMSTOHRS;

          // make sure shift end is later than shift start
          if (totalHoursWorkedPerShift > 0) {
            totalRegularHoursWorkedPerUser += totalHoursWorkedPerShift;
          }

          totalHoursOvernightPerUser += returnOvernightHours(
            shiftStart,
            shiftEnd
          );

          if (
            currUserId in schedulesObj &&
            shiftStart.toLocaleDateString() in schedulesObj[currUserId]
          ) {
            const getScheduleOfTheDay =
              schedulesObj[currUserId][shiftStart.toLocaleDateString()];

            const scheduleShiftStart = getScheduleOfTheDay.shiftStart;
            const scheduleShiftEnd = getScheduleOfTheDay.shiftEnd;

            const getScheduleDuration =
              scheduleShiftEnd.getTime() - scheduleShiftStart.getTime();

            const getTimeClockDuration =
              shiftEnd.getTime() - shiftStart.getTime();

            // get difference in schedule duration and time clock duration
            const getShiftDurationDiff =
              getTimeClockDuration - getScheduleDuration;

            // if timeclock > schedule -- overtime, else -- late
            if (getShiftDurationDiff > 0) {
              totalHoursOvertimePerUser += getShiftDurationDiff / MMSTOHRS;
            } else {
              totalMinsLatePerUser += getShiftDurationDiff / MMSTOMINS;
            }
          }
        }
      });

      // deduct overtime from worked hours
      totalRegularHoursWorkedPerUser -= totalHoursOvertimePerUser;
      totalHoursWorkedPerUser =
        totalRegularHoursWorkedPerUser + totalHoursOvertimePerUser;
    }

    if (currUserScheduleShifts) {
      totalDaysScheduledPerUser += new Set(
        currUserScheduleShifts.map(shiftOfSchedule =>
          new Date(shiftOfSchedule.shiftStart).toLocaleDateString()
        )
      ).size;

      currUserScheduleShifts.forEach(scheduledDay => {
        const shiftStart = scheduledDay.shiftStart;
        const shiftEnd = scheduledDay.shiftEnd;
        // get time in hours
        const totalHoursScheduledPerShift =
          (shiftEnd.getTime() - shiftStart.getTime()) / MMSTOHRS;
        // make sure shift end is later than shift start
        if (totalHoursScheduledPerShift > 0) {
          totalHoursScheduledPerUser += totalHoursScheduledPerShift;
        }
      });
    }

    usersReport[currUserId] = {
      ...usersReport[currUserId],
      totalDaysScheduled: totalDaysScheduledPerUser,
      totalHoursScheduled: totalHoursScheduledPerUser,
      totalDaysWorked: totalDaysWorkedPerUser,
      totalRegularHoursWorked: totalRegularHoursWorkedPerUser,
      totalHoursWorked: totalHoursWorkedPerUser,
      totalHoursOvertime: totalHoursOvertimePerUser,
      totalHoursOvernight: totalHoursOvernightPerUser,
      totalMinsLate: totalMinsLatePerUser
    };
    // if (exportToXlsx) {
    //   usersReport[currUserId].totalDaysScheduled = totalDaysScheduledPerUser;
    //   usersReport[currUserId].totalDaysWorked = totalDaysWorkedPerUser;
    //   usersReport[currUserId].totalHoursScheduled = totalHoursScheduledPerUser;
    //   usersReport[currUserId].totalHoursWorked = totalHoursWorkedPerUser;
    //   usersReport[currUserId].totalHoursOvertime = totalHoursOvertimePerUser;
    //   usersReport[currUserId].totalMinsLate = totalMinsLatePerUser;
    // } else {
    //   usersReport[currUserId] = {
    //     totalDaysScheduled: totalDaysScheduledPerUser,
    //     totalHoursScheduled: totalHoursScheduledPerUser,
    //     totalDaysWorked: totalDaysWorkedPerUser,
    //     totalHoursWorked: totalHoursWorkedPerUser,
    //     totalHoursOvertime: totalHoursOvertimePerUser,
    //     totalHoursOvernight: totalHoursOvernightPerUser,
    //     totalMinsLate: totalMinsLatePerUser
    //   };
    // }
  });

  return usersReport;
};

export const timeclockReportPivot = async (
  subdomain: string,
  userIds: string[],
  startDate?: string,
  endDate?: string,
  teamMembersObj?: any,
  exportToXlsx?: boolean
) => {
  const models = await generateModels(subdomain);
  const usersReport: IUserReport = { scheduleReport: [] };
  const shiftsOfSchedule: any = [];

  // get the schedule data of this month
  const schedules = await models.Schedules.find({
    userId: { $in: userIds }
  }).sort({
    userId: 1
  });

  const scheduleIds = schedules.map(schedule => schedule._id);

  const timeclocks = await models.Timeclocks.find({
    $and: [
      { userId: { $in: userIds } },
      {
        shiftStart: {
          $gte: fixDate(startDate),
          $lte: fixDate(endDate)
        }
      },
      {
        shiftEnd: {
          $gte: fixDate(startDate),
          $lte: fixDate(endDate)
        }
      }
    ]
  }).sort({ userId: 1 });

  shiftsOfSchedule.push(
    ...(await models.Shifts.find({
      $and: [
        { scheduleId: { $in: scheduleIds } },
        { status: 'Approved' },
        {
          shiftStart: {
            $gte: fixDate(startDate),
            $lte: fixDate(endDate)
          }
        }
      ]
    }))
  );

  const schedulesObj = createSchedulesObj(userIds, schedules, shiftsOfSchedule);

  userIds.forEach(async currUserId => {
    // assign team member info from teamMembersObj

    if (exportToXlsx) {
      usersReport[currUserId] = { ...teamMembersObj[currUserId] };
    }

    const currUserTimeclocks = timeclocks.filter(
      timeclock => timeclock.userId === currUserId
    );

    const currUserSchedules = schedules.filter(
      schedule => schedule.userId === currUserId
    );

    // get shifts of schedule
    const currUserScheduleShifts: any = [];
    currUserSchedules.forEach(userSchedule => {
      currUserScheduleShifts.push(
        ...shiftsOfSchedule.filter(
          scheduleShift => scheduleShift.scheduleId === userSchedule._id
        )
      );
    });

    const totalShiftsOfUser: any = [];

    if (currUserTimeclocks) {
      currUserTimeclocks.forEach(currUserTimeclock => {
        let totalHoursOvertimePerShift = 0;
        let totalMinsLatePerShift = 0;
        let totalHoursOvernightPerShift = 0;

        const shiftStart = currUserTimeclock.shiftStart;
        const shiftEnd = currUserTimeclock.shiftEnd;
        if (shiftStart && shiftEnd) {
          totalHoursOvernightPerShift = returnOvernightHours(
            shiftStart,
            shiftEnd
          );

          const scheduledDay = shiftStart.toLocaleDateString();
          const getTimeClockDuration =
            shiftEnd.getTime() - shiftStart.getTime();

          let scheduleShiftStart;
          let scheduleShiftEnd;
          let getScheduleDuration: number = 0;
          if (
            currUserId in schedulesObj &&
            scheduledDay in schedulesObj[currUserId]
          ) {
            const getScheduleOfTheDay = schedulesObj[currUserId][scheduledDay];

            scheduleShiftStart = getScheduleOfTheDay.shiftStart;
            scheduleShiftEnd = getScheduleOfTheDay.shiftEnd;

            getScheduleDuration =
              scheduleShiftEnd.getTime() - scheduleShiftStart.getTime();

            // get difference in schedule duration and time clock duration
            const getShiftDurationDiff =
              getTimeClockDuration - getScheduleDuration;

            // if timeclock > schedule --> overtime, else --> late
            if (getShiftDurationDiff > 0) {
              totalHoursOvertimePerShift = getShiftDurationDiff / MMSTOHRS;
            } else {
              totalMinsLatePerShift =
                Math.abs(getShiftDurationDiff) / MMSTOMINS;
            }
          }

          totalShiftsOfUser.push({
            timeclockDate: scheduledDay,
            timeclockStart: shiftStart,
            timeclockEnd: shiftEnd,
            timeclockDuration: getTimeClockDuration / MMSTOHRS,
            deviceType: currUserTimeclock.deviceType,
            deviceName: currUserTimeclock.deviceName,
            scheduledStart: scheduleShiftStart,
            scheduledEnd: scheduleShiftEnd,
            scheduledDuration: getScheduleDuration / MMSTOHRS,
            totalMinsLate: totalMinsLatePerShift,
            totalHoursOvertime: totalHoursOvertimePerShift,
            totalHoursOvernight: totalHoursOvernightPerShift
          });
        }
      });
    }

    usersReport[currUserId] = {
      ...usersReport[currUserId],
      scheduleReport: totalShiftsOfUser
    };
  });

  return usersReport;
};

const returnOvernightHours = (shiftStart: Date, shiftEnd: Date) => {
  // check whether shift is between 22:00 - 06:00, if so return how many hours is overnight
  const shiftDay = shiftStart.toLocaleDateString();
  const nextDay = dayjs(shiftDay)
    .add(1, 'day')
    .toDate();
  const overnightStart = dayjs(shiftDay + ' ' + '22:00:00').toDate();
  const overnightEnd = dayjs(nextDay + ' ' + '06:00:00').toDate();

  let totalOvernightHours = 0;

  // if shift end is less than 22:00 then no overnight time
  if (shiftEnd > overnightStart) {
    const getOvernightDuration =
      (shiftEnd > overnightEnd ? overnightEnd.getTime() : shiftEnd.getTime()) -
      (shiftStart < overnightStart
        ? overnightStart.getTime()
        : shiftStart.getTime());

    totalOvernightHours += getOvernightDuration / MMSTOHRS;
  }

  return totalOvernightHours;
};

const createSchedulesObj = (
  userIds: string[],
  totalSchedules: IScheduleDocument[],
  totalScheduleShifts: IShiftDocument[]
) => {
  const returnObject = {};

  for (const userId of userIds) {
    const currEmpSchedules = totalSchedules.filter(
      schedule => schedule.userId === userId
    );

    if (currEmpSchedules.length) {
      returnObject[userId] = {};
    }
    for (const empSchedule of currEmpSchedules) {
      const currEmpScheduleShifts = totalScheduleShifts.filter(
        scheduleShift => scheduleShift.scheduleId === empSchedule._id
      );

      currEmpScheduleShifts.forEach(currEmpScheduleShift => {
        const date_key = currEmpScheduleShift.shiftStart?.toLocaleDateString();
        returnObject[userId][date_key] = {
          shiftStart: currEmpScheduleShift.shiftStart,
          shiftEnd: currEmpScheduleShift.shiftEnd
        };
      });
    }
  }

  return returnObject;
};
