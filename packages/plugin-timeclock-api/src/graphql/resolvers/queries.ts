import { IContext } from '../../connectionResolver';
import { fixDate } from '@erxes/api-utils/src/core';
import { findBranch, findDepartment } from '../../departments';
import schedule from './schedule';
import { title } from 'process';

const templateQueries = {
  absences(
    _root,
    {
      startDate,
      endDate,
      userId
    }: { startDate: Date; endDate: Date; userId: string },
    { models, commonQuerySelector }: IContext
  ) {
    const selector: any = { ...commonQuerySelector };
    const timeFields = [
      {
        startTime: {
          $gte: fixDate(startDate),
          $lte: fixDate(endDate)
        }
      },
      {
        endTime: {
          $gte: fixDate(startDate),
          $lte: fixDate(endDate)
        }
      }
    ];

    if (startDate && endDate) {
      selector.$or = timeFields;
    }
    if (userId) {
      selector.userId = userId;
    }

    selector.status = { $ne: 'Holiday' };
    return models.Absences.find(selector);
  },

  absenceTypes(_root, {}, { models }: IContext) {
    return models.AbsenceTypes.find();
  },

  holidays(_root, {}, { models }: IContext) {
    return models.Absences.find({ status: 'Holiday' });
  },

  async timeclocks(
    _root,
    {
      startDate,
      endDate,
      userIds
    }: { startDate: Date; endDate: Date; userIds: string[] },
    { models, commonQuerySelector }: IContext
  ) {
    const selector: any = { ...commonQuerySelector };

    const timeFields = [
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
    ];

    if (startDate && endDate) {
      selector.$or = timeFields;
    }

    let returnModel: any = [];

    if (userIds) {
      for (const userId of userIds) {
        returnModel.push(
          ...(await models.Templates.find({
            $or: [...timeFields, { userId: `${userId}` }]
          }))
        );
      }
    } else {
      returnModel = models.Templates.find(selector);
    }

    return returnModel;
  },

  async schedules(
    _root,
    { startDate, endDate, userId },
    { models, commonQuerySelector }: IContext
  ) {
    const selector: any = { ...commonQuerySelector };

    if (userId) {
      selector.userId = userId;
    }

    const schedules = await models.Schedules.find(selector);
    return schedules;
  },

  payDates(_root, {}, { models }: IContext) {
    return models.PayDates.find();
  },

  timeclockDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Templates.findOne({ _id });
  },

  absenceDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Absences.findOne({ _id });
  },

  scheduleDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Schedules.findOne({ _id });
  },

  // async returnUserIdsOfBranches(
  //   _root,
  //   { branchIds }: { branchIds: string[] },
  //   { models, subdomain }: IContext
  // ) {
  //   const finalUserIds: string[] = [];
  //   for (const branchId of branchIds) {
  //     const branch = await findBranch(subdomain, branchId);
  //     finalUserIds.push(branch.userIds);
  //   }
  //   return finalUserIds;
  // },

  async timeclockReportByUser(
    _root,
    { selectedUser },
    { models, user }: IContext
  ) {
    interface IScheduleReport {
      date?: string;
      scheduleStart?: Date;
      scheduleEnd?: Date;
      recordedStart?: Date;
      recordedEnd?: Date;
      minsLate?: number;
      minsWorked?: number;
      include?: boolean;
    }

    interface IUserReport {
      userId?: string;
      scheduleReport: IScheduleReport[];
      totalMinsWorkedToday?: number;
      totalMinsScheduledToday?: number;
      totalMinsWorkedThisMonth?: number;
      totalMinsScheduledThisMonth?: number;
      totalMinsLateToday?: number;
      totalMinsLateThisMonth?: number;
      totalMinsAbsenceThisMonth?: number;
    }

    const userId = selectedUser || user._id;
    let report: IUserReport = {
      scheduleReport: [],
      userId: `${userId}`,
      totalMinsScheduledThisMonth: 0
    };
    const shifts_of_schedule: any = [];

    // get 1st of the next Month
    const NOW = new Date();
    const startOfNextMonth = new Date(NOW.getFullYear(), NOW.getMonth() + 1, 1);
    // get 1st of this month
    const startOfThisMonth = new Date(NOW.getFullYear(), NOW.getMonth(), 1);
    // get the schedule data of this month
    const schedules = models.Schedules.find({ userId: `${userId}` });
    const timeclocks = models.Templates.find({
      $or: [
        { userId: `${userId}` },
        {
          shiftStart: {
            $gte: fixDate(startOfThisMonth),
            $lt: fixDate(startOfNextMonth)
          }
        }
      ]
    });
    const absences = models.Absences.find({
      $or: [
        {
          userId: `${userId}`,
          status: 'Approved'
        },
        {
          startTime: {
            $gte: fixDate(startOfThisMonth),
            $lt: fixDate(startOfNextMonth)
          }
        }
      ]
    });

    for (const { _id } of await schedules) {
      shifts_of_schedule.push(
        ...(await models.Shifts.find({
          $or: [
            { scheduleId: _id },
            { status: 'Approved' },
            {
              shiftStart: {
                $gte: fixDate(startOfThisMonth),
                $lt: fixDate(startOfNextMonth)
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

      for (const scheduleShift of shifts_of_schedule) {
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
          userSchedule.scheduleEnd.getTime() -
          userSchedule.recordedEnd.getTime();

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
  },

  async timeclockReports(
    _root,
    { departmentIds, branchIds, userIds },
    { models, subdomain }: IContext
  ) {
    let department;
    const branchUsers: IGroup[] = [];
    const departmentUsers: IGroup[] = [];
    let branch;

    interface IGroup {
      userIds: string[];
      title: string;
    }

    interface IReport {
      groupTitle: string;
      groupReport: IUserReport[];
      groupTotalMinsWorked?: number;
      groupTotalMinsLate?: number;
      groupTotalAbsenceMins?: number;
      groupTotalMinsScheduled?: number;
    }

    interface IUserReport {
      userId?: string;
      scheduleReport: IScheduleReport[];
      totalMinsWorked?: number;
      totalMinsLate?: number;
      totalAbsenceMins?: number;
      totalMinsScheduled?: number;
    }

    interface IScheduleReport {
      date?: string;
      scheduleStart?: Date;
      scheduleEnd?: Date;
      recordedStart?: Date;
      recordedEnd?: Date;
      minsLate?: number;
      minsWorked?: number;
    }

    const finalReport: IReport[] = [];
    const returnReportByUserIds = async (
      selectedUserIds: string[]
    ): Promise<[IUserReport[], number, number, number, number]> => {
      let idx = 0;
      const reports: IUserReport[] = [];
      let groupTotalAbsence = 0;
      let groupTotalMinsWorked = 0;
      let groupTotalMinsScheduled = 0;

      for (const userId of selectedUserIds) {
        const schedules = models.Schedules.find({ userId: `${userId}` });
        const timeclocks = models.Templates.find({ userId: `${userId}` });
        const absences = models.Absences.find({
          userId: `${userId}`,
          status: 'Approved'
        });
        const shifts_of_schedule: any = [];

        for (const { _id } of await schedules) {
          shifts_of_schedule.push(
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
          reports.push({ userId: `${userId}`, scheduleReport: [] });

          let totalMinsWorkedPerUser = 0;
          let totalMinsScheduledPerUser = 0;

          for (const timeclock of await timeclocks) {
            const previousSchedules = reports[idx].scheduleReport;

            const shiftDuration =
              timeclock.shiftEnd &&
              timeclock.shiftStart &&
              Math.round(
                (timeclock.shiftEnd.getTime() -
                  timeclock.shiftStart.getTime()) /
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

          for (const scheduleShift of shifts_of_schedule) {
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
                (absence.endTime.getTime() - absence.startTime.getTime()) /
                60000;
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
      reports.forEach((userReport, group_report_idx) => {
        let totalMinsLatePerUser = 0;
        console.log(userReport);
        userReport.scheduleReport.forEach((userSchedule, user_report_idx) => {
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
            userReport.scheduleReport[user_report_idx] = {
              ...userSchedule,
              minsLate: sumMinsLate
            };
          }
        });

        groupTotalMinsLate += totalMinsLatePerUser;
        reports[group_report_idx] = {
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

    if (departmentIds || branchIds) {
      if (departmentIds) {
        for (const departmentId of departmentIds) {
          department = await findDepartment(subdomain, departmentId);
          departmentUsers.push({
            userIds: department.userIds,
            title: department.title
          });
        }
      }
      if (branchIds) {
        for (const branchId of branchIds) {
          branch = await findBranch(subdomain, branchId);
          branchUsers.push({ userIds: branch.userIds, title: branch.title });
        }
      }

      // if both branch and department ids are given
      if (branchIds && departmentIds) {
        const departmentUserIds: string[] = [];
        const branchUserIds: string[] = [];

        for (const deptUser of departmentUsers) {
          departmentUserIds.push(...deptUser.userIds);
        }
        for (const brnchUser of branchUsers) {
          branchUserIds.push(...brnchUser.userIds);
        }

        const commonUserIds = departmentUserIds.filter(x =>
          branchUserIds.includes(x)
        );

        const [
          reportsReturned,
          totalMinsLatePerGroup,
          totalAbsenceMinsPerGroup,
          totalWorkedMinsPerGroup
        ] = await returnReportByUserIds(commonUserIds);
        finalReport.push({
          groupReport: [...reportsReturned],
          groupTitle: '',
          groupTotalMinsLate: totalMinsLatePerGroup,
          groupTotalAbsenceMins: totalAbsenceMinsPerGroup,
          groupTotalMinsWorked: totalWorkedMinsPerGroup
        });
      } else {
        // for each department, push dept users' report with department title
        for (const dept of departmentUsers) {
          const departmentUserIds = [...dept.userIds];
          const [
            departmentReport,
            totalMinsLatePerGroup,
            totalAbsenceMinsPerGroup,
            totalWorkedMinsPerGroup
          ] = await returnReportByUserIds(departmentUserIds);

          finalReport.push({
            groupReport: departmentReport.slice(),
            groupTitle: dept.title,
            groupTotalMinsLate: totalMinsLatePerGroup,
            groupTotalAbsenceMins: totalAbsenceMinsPerGroup,
            groupTotalMinsWorked: totalWorkedMinsPerGroup
          });
        }

        // for each branch, push branch users' report with branch title
        for (const brnch of branchUsers) {
          const branchUserIds = [...brnch.userIds];
          const [
            branchReport,
            totalMinsLatePerGroup,
            totalAbsenceMinsPerGroup,
            totalWorkedMinsPerGroup,
            totalScheduledMinsPerGroup
          ] = await returnReportByUserIds(branchUserIds);
          finalReport.push({
            groupReport: [...branchReport],
            groupTitle: brnch.title,
            groupTotalMinsLate: totalMinsLatePerGroup,
            groupTotalAbsenceMins: totalAbsenceMinsPerGroup,
            groupTotalMinsWorked: totalWorkedMinsPerGroup,
            groupTotalMinsScheduled: totalScheduledMinsPerGroup
          });
        }
      }
    }

    return finalReport;
  }
};

export default templateQueries;
