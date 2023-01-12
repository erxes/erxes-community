import { IContext } from '../../connectionResolver';
import { IScheduleConfigDocument } from '../../models/definitions/timeclock';
import { fixDate } from '@erxes/api-utils/src';

export default {
  async configDays(
    { _id }: IScheduleConfigDocument,
    {},
    { models }: IContext,
    { variableValues }
  ) {
    return models.Shifts.find({ scheduleConfigId: _id });
  }
};
