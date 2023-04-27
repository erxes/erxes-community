import { IAdjustment, adjustmentSchema } from './definitions/adjustments';
import { Model } from 'mongoose';
import { IAdjustmentDocument } from './definitions/adjustments';
import { IModels } from '../connectionResolver';
import { FilterQuery } from 'mongodb';

export const loadAdjustmentClass = (models: IModels) => {
  class Adjustment {
    /**
     *
     * Get Adjustment
     */

    public static async getAdjustment(selector: FilterQuery<IAdjustment>) {
      const adjustment = await models.Adjustments.findOne(selector);

      if (!adjustment) {
        throw new Error('Adjustment not found');
      }

      return adjustment;
    }

    /**
     * Create a adjustment
     */
    public static async createAdjustment(doc: IAdjustment) {
      return models.Adjustments.create(doc);
    }

    /**
     * Update Adjustment
     */
    public static async updateAdjustment(_id: string, doc: IAdjustment) {
      await models.Adjustments.updateOne({ _id }, { $set: doc });

      return models.Adjustments.findOne({ _id });
    }

    /**
     * Remove Adjustment
     */
    public static async removeAdjustments(_ids: string[]) {
      return models.Adjustments.deleteMany({ _id: { $in: _ids } });
    }
  }
  adjustmentSchema.loadClass(Adjustment);
  return adjustmentSchema;
};
export interface IAdjustmentModel extends Model<IAdjustmentDocument> {
  getAdjustment(selector: FilterQuery<IAdjustmentDocument>);
  createAdjustment(doc: IAdjustment);
  updateAdjustment(_id: string, doc: IAdjustment);
  removeAdjustments(_ids: string[]);
}
