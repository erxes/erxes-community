import {
  IDynamic,
  IDynamicDocument,
  msdynamicSchema
} from './definitions/dynamic';
import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';
import { IUser } from '@erxes/api-utils/src/types';

export interface IDynamicModel extends Model<IDynamicDocument> {
  meetingDetail(_id: string, userId: string): Promise<IDynamicDocument>;
  createMsdynamic(args: IDynamic): Promise<IDynamicDocument>;
  updateMsdynamic(args: IDynamic): Promise<IDynamicDocument>;
  removeMsdynamic(_id: string): Promise<IDynamicDocument>;
}

export const loadDynamicClass = (model: IModels) => {
  class Msdynamic {
    // create
    public static async createMsdynamic(doc: IDynamic) {
      return await model.Msdynamics.create({
        ...doc,
        createdAt: new Date()
      });
    }
    // update
    public static async updateMsdynamic(doc: IDynamic) {
      await model.Msdynamics.updateOne(
        { _id: doc._id },
        { $set: { ...doc } }
      ).then(err => console.error(err));
    }
    // remove
    public static async removeMsdynamic(_id: string) {
      return model.Msdynamics.deleteOne({ _id });
    }
  }

  msdynamicSchema.loadClass(Msdynamic);

  return msdynamicSchema;
};
