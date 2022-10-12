import { Model } from 'mongoose';

import { IModels } from '../connectionResolver';
import {
  IPaymentConfig,
  IPaymentConfigDocument,
  paymentConfigSchema
} from './definitions/paymentConfigs';

export interface IPaymentConfigModel extends Model<IPaymentConfigDocument> {
  createOrUpdate(doc: IPaymentConfig): Promise<IPaymentConfigDocument>;
  removePaymentConfig(_id: string): void;
  getPaymentConfig(doc: any): Promise<IPaymentConfigDocument>;
}

export const loadPaymentConfigClass = (models: IModels) => {
  class PaymentConfig {
    public static async createOrUpdate(doc: IPaymentConfig) {
      const paymentConfig = await models.PaymentConfigs.findOne({
        contentType: doc.contentType,
        contentTypeId: doc.contentTypeId
      });

      if (paymentConfig) {
        return models.PaymentConfigs.updateOne(
          { _id: paymentConfig._id },
          { $set: { paymentIds: doc.paymentIds } }
        );
      }

      return models.PaymentConfigs.create(doc);
    }

    public static async removePaymentConfig(_id: string) {
      return models.PaymentConfigs.deleteOne({ _id });
    }

    public static async getPaymentConfig(doc: any) {
      const paymentConfig = await models.PaymentConfigs.findOne(doc);

      if (!paymentConfig) {
        throw new Error('Payment Config not found');
      }

      return paymentConfig;
    }
  }

  paymentConfigSchema.loadClass(PaymentConfig);

  return paymentConfigSchema;
};
