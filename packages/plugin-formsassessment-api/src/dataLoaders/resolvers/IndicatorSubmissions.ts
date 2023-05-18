import { IContext } from '../../connectionResolver';
import { sendCoreMessage } from '../../messageBroker';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.AssessmentsItems.findOne({ _id });
  },
  user({ _id }, {}, { subdomain }: IContext) {
    return sendCoreMessage({
      subdomain,
      action: 'users.findOne',
      data: { _id },
      isRPC: true,
      defaultValue: {}
    });
  }
};
