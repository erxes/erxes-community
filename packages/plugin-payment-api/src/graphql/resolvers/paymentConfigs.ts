import { IContext } from '../../connectionResolver';
import { sendFormsMessage } from '../../messageBroker';
import { IPaymentConfig } from '../../models/definitions/paymentConfigs';
import { serviceDiscovery } from './../../configs';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.PaymentConfigs.findOne({ _id });
  },

  async contentName(config: IPaymentConfig, {}, { subdomain }: IContext) {
    if (config.contentType.includes('forms')) {
      if (!(await serviceDiscovery.isEnabled('forms'))) {
        return 'Forms service is not enabled';
      }

      const form = await sendFormsMessage({
        subdomain,
        action: 'findOne',
        data: {
          _id: config.contentTypeId
        },
        isRPC: true,
        defaultValue: {}
      });

      return form.title;
    }

    /// TODO: add other content types
    return config.contentTypeId;
  }
};
