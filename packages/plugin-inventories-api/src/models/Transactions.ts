import { Model } from 'mongoose';
import * as _ from 'underscore';
import { IModels } from '../connectionResolver';
import {
  ITransaction,
  ITransactionCreateParams,
  ITransactionDocument,
  transactionSchema
} from './definitions/transactions';
import { ITransactionItem } from './definitions/transactionItems';

export interface ITransactionModel extends Model<ITransactionDocument> {
  getTransaction(_id: string): Promise<ITransactionDocument>;
  createTransaction(
    params: ITransactionCreateParams
  ): Promise<ITransactionDocument>;
}

export const loadTransactionClass = (models: IModels) => {
  class Transaction {
    /**
     * Get transaction
     * @param _id Transaction ID
     * @returns Found object
     */
    public static async getTransaction(_id: string) {
      const result: any = await models.Transactions.findById(_id);

      if (!result) throw new Error('Transaction not found!');

      return result;
    }

    /**
     * Create transaction
     * @param params New data to create
     * @returns Created response
     */
    public static async createTransaction(params: ITransactionCreateParams) {
      const {
        departmentId,
        branchId,
        status,
        contentType,
        contentId,
        products
      } = params;

      const transaction = await models.Transactions.create({
        departmentId,
        branchId,
        status,
        contentType,
        contentId,
        createdAt: new Date()
      });

      const bulkOps: any[] = [];

      products.map(async (item: any) => {
        const filter: any = { productId: item.productId };
        if (departmentId) filter.departmentId = departmentId;
        if (branchId) filter.branchId = branchId;
        if (item.remainderId) filter.remainderId = item.remainderId;

        const remainder: any = await models.Remainders.findOne(filter);

        if (!remainder) return new Error('Remainder not found!');

        const safeRemainderItem: any = await models.SafeRemainderItems.findOne(
          filter
        );

        if (!safeRemainderItem)
          return new Error('Safe remainder item not found!');

        await models.SafeRemainderItems.updateOne(filter, {
          $set: { preCount: item.count }
        });

        const result = await models.Remainders.updateRemainder(remainder._id, {
          count: item.isDebit ? item.count : -1 * item.count
        });

        if (!result) return new Error('Remainder update failed!');

        bulkOps.push({
          transactionId: result._id,
          productId: item.productId,
          count: item.count,
          uomId: item.uomId,
          isDebit: true,

          modifiedAt: new Date()
        });
      });

      await models.TransactionItems.insertMany(bulkOps);

      return transaction;
    }
  }

  transactionSchema.loadClass(Transaction);

  return transactionSchema;
};
