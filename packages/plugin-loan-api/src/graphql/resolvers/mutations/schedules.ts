import { SCHEDULE_STATUS } from '../../../models/definitions/constants';
import { reGenerateSchedules } from '../../../models/utils/scheduleUtils';
import { IPerHoliday } from '../../../models/utils/utils';
import { checkPermission } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import redis from '../../../redis';

const scheduleMutations = {
  regenSchedules: async (
    _root,
    { contractId }: { contractId: string },
    { user, models }: IContext
  ) => {
    const doneSchedules = await models.Schedules.find({
      contractId,
      status: { $in: [SCHEDULE_STATUS.DONE, SCHEDULE_STATUS.LESS] }
    }).lean();
    if (doneSchedules && doneSchedules.length) {
      const trs = await models.Transactions.find({ contractId }).lean();
      if (trs && trs.length) {
        throw new Error('Schedule has related transaction');
      }
    }

    // const holidayConfig = (await getConfig(
    //   models,
    //   redis,
    //   'holidayConfig',
    //   {}
    // )) as [IPerHoliday];
    // const perHolidays = Object.keys(holidayConfig).map(key => ({
    //   month: Number(holidayConfig[key].month) - 1,
    //   day: Number(holidayConfig[key].day)
    // }));

    const contract = await models.Contracts.getContract({
      _id: contractId
    });
    await reGenerateSchedules(models, contract, []);

    return 'ok';
  }
};
checkPermission(scheduleMutations, 'regenSchedules', 'saveSchedules');

export default scheduleMutations;
