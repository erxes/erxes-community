import {
  IDynamic,
  IDynamicDocument,
  msdynamicSchema
} from './definitions/dynamic';
import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';

export interface IDynamicModel extends Model<IDynamicDocument> {
  meetingDetail(_id: string, userId: string): Promise<IDynamicDocument>;
  createMsdynamicConfig(args: IDynamic): Promise<IDynamicDocument>;
  updateMsdynamicConfig(args: IDynamic): Promise<IDynamicDocument>;
}

export const loadDynamicClass = (model: IModels) => {
  class Msdynamic {
    // create
    public static async createMsdynamicConfig(doc: IDynamic) {
      return await model.Msdynamics.create({
        ...doc,
        createdAt: new Date()
      });
    }
    // update
    public static async updateMsdynamicConfig(doc: IDynamic) {
      await model.Msdynamics.updateOne(
        { _id: doc._id },
        { $set: { ...doc } }
      ).then(err => console.error(err));
    }
  }

  msdynamicSchema.loadClass(Msdynamic);

  return msdynamicSchema;
};
