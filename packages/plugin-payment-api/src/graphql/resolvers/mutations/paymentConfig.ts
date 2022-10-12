import { IContext } from '../../../connectionResolver';
import { IPaymentConfig } from '../../../models/definitions/paymentConfigs';

const mutations = {
  async setPaymentConfig(_root, args: IPaymentConfig, { models }: IContext) {
    return models.PaymentConfigs.createOrUpdate(args);
  },

  async removePaymentConfig(
    _root,
    args: { contentType: string; contentTypeId: string },
    { models }: IContext
  ) {
    const { contentType, contentTypeId } = args;
    const config = await models.PaymentConfigs.getPaymentConfig({
      contentType,
      contentTypeId
    });

    return models.PaymentConfigs.remove(config._id);
  }
};

export default mutations;
