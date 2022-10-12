import { IContext } from '../../../connectionResolver';

const queries = {
  getPaymentConfig(
    _root,
    args: { contentType: string; contentTypeId: string },
    { models }: IContext
  ) {
    return models.PaymentConfigs.getPaymentConfig(args);
  }
};

export default queries;
