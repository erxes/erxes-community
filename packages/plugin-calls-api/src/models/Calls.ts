import { Model } from 'mongoose';

import { ICalls, ICallsDocument, callsSchema } from './definitions/calls';
import { IModels } from '../connectionResolver';

export interface ICallsModel extends Model<ICallsDocument> {
  getCalls(_id: string): Promise<ICallsDocument>;
  createCalls(doc: ICalls): Promise<ICallsDocument>;
  updateCalls(_id: string, doc: ICalls): Promise<ICallsDocument>;
  removeCalls(_id: string): void;
}

export const loadCallsClass = (models: IModels) => {
  class Calls {
    // get
    public static async getCalls(_id: string) {
      const calls = await models.Calls.findOne({ _id });

      if (!calls) {
        throw new Error('Calls not found');
      }

      return calls;
    }

    // create
    public static async createCalls(doc) {
      return models.Calls.create({
        ...doc,
        createdAt: new Date()
      });
    }

    // update
    public static async updateCalls(_id: string, doc) {
      await models.Calls.updateOne({ _id }, { $set: { ...doc } }).then(err =>
        console.error(err)
      );
    }

    // remove
    public static async removeCalls(_id: string) {
      return models.Calls.deleteOne({ _id });
    }
  }

  callsSchema.loadClass(Calls);

  return callsSchema;
};
