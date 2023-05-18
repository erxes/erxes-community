import { IContext } from '../../connectionResolver';
import { sendCoreMessage } from '../../messageBroker';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.AssessmentsItems.findOne({ _id });
  },
  async item({ itemId }, {}, { models }: IContext) {
    return await models.Items.findOne({ _id: itemId });
  }
};
