import { SCHEDULE_STATUS } from '../../../models/definitions/constants';
import { reGenerateSchedules } from '../../../models/utils/scheduleUtils';
import { checkPermission } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import { sendMessageBroker } from '../../../messageBroker';

const scheduleMutations = {
  regenSchedules: async (
    _root,
    { contractId }: { contractId: string },
    { models, subdomain }: IContext
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

    const holidayConfig: any = await sendMessageBroker(
      {
        subdomain,
        action: 'configs.findOne',
        data: {
          query: {
            code: 'holidayConfig'
          }
        },
        isRPC: true
      },
      'core'
    );

    const perHolidays = !holidayConfig?.value
      ? []
      : Object.keys(holidayConfig.value).map(key => ({
          month: Number(holidayConfig.value[key].month) - 1,
          day: Number(holidayConfig.value[key].day)
        }));

    const contract = await models.Contracts.getContract({
      _id: contractId
    });
    await reGenerateSchedules(models, contract, perHolidays);

    return 'ok';
  }
};
checkPermission(scheduleMutations, 'regenSchedules', 'saveSchedules');

export default scheduleMutations;
