import { Model } from 'mongoose';

import { IModels } from '../connectionResolver';
import {
  IKhanbankAccountConfig,
  IKhanbankAccountConfigDocument,
  khanbankAccountConfigSchema
} from './definitions/khanbankAccounts';

export interface IKhanbankAccountConfigModel
  extends Model<IKhanbankAccountConfigDocument> {
  createAccount(
    doc: IKhanbankAccountConfig
  ): Promise<IKhanbankAccountConfigDocument>;
  updateAccount(_id: string, doc: any): Promise<IKhanbankAccountConfigDocument>;
  getAccount(doc: any): Promise<IKhanbankAccountConfigDocument>;
  removeAccount(_id: string): void;
  changeStatus(_id: string): Promise<IKhanbankAccountConfigDocument>;
}

export const loadKhanbankAccountClass = (models: IModels) => {
  class KhanbankAccount {
    public static async createAccount(doc: IKhanbankAccountConfig) {
      const account = await models.KhanbankAccounts.findOne({
        accountNumber: doc.accountNumber
      });

      if (account) {
        throw new Error('Account already exists');
      }

      return models.KhanbankAccounts.create(doc);
    }

    public static async updateAccount(_id: string, doc: any) {
      const account = await models.KhanbankAccounts.findOne({
        accountNumber: doc.accountNumber
      });

      if (account && account._id !== _id) {
        throw new Error('Account exists with same number');
      }

      await models.KhanbankAccounts.updateOne({ _id }, { $set: doc });

      return models.KhanbankAccounts.getAccount({ _id });
    }

    public static async removeAccount(_id: string) {
      return models.KhanbankAccounts.remove({ _id });
    }

    public static async getAccount(doc: any) {
      const account = await models.KhanbankAccounts.findOne(doc).lean();

      if (!account) {
        throw new Error('Account not found');
      }

      return account;
    }

    public static async changeStatus(_id: string) {
      const account = await models.KhanbankAccounts.findOne({ _id });

      if (!account) {
        throw new Error('Account not found');
      }

      await models.KhanbankAccounts.updateOne(
        { _id },
        { $set: { isActive: !account.isActive } }
      );

      return models.KhanbankAccounts.getAccount({ _id });
    }
  }

  khanbankAccountConfigSchema.loadClass(KhanbankAccount);

  return khanbankAccountConfigSchema;
};
