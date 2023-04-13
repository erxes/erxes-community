import { insuranceTypeSchema } from './definitions/insuranceTypes';
import { IInsuranceTypeDocument } from '../models/definitions/insuranceTypes';
import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';

export interface IInsuranceTypeModel extends Model<IInsuranceTypeDocument> {
  getInsuranceType(selector: any);
  createInsuranceType(doc);
  updateInsuranceType(_id, doc);
  removeInsuranceTypes(_ids);
}

export const loadInsuranceTypeClass = (models: IModels) => {
  class InsuranceType {
    /**
     *
     * Get InsuranceType
     */

    public static async getInsuranceType(selector: any) {
      const insuranceType = await models.InsuranceTypes.findOne(selector);

      if (!insuranceType) {
        throw new Error('InsuranceType not found');
      }

      return insuranceType;
    }

    /**
     * Create a insuranceType
     */
    public static async createInsuranceType(doc) {
      return models.InsuranceTypes.create(doc);
    }

    /**
     * Update InsuranceType
     */
    public static async updateInsuranceType(_id, doc) {
      await models.InsuranceTypes.updateOne({ _id }, { $set: doc });

      return models.InsuranceTypes.findOne({ _id });
    }

    /**
     * Remove InsuranceType
     */
    public static async removeInsuranceTypes(_ids) {
      // await models.InsuranceTypes.getInsuranceTypeCatogery(models, { _id });
      // TODO: check collateralsData
      return models.InsuranceTypes.deleteMany({ _id: { $in: _ids } });
    }
  }
  insuranceTypeSchema.loadClass(InsuranceType);
  return insuranceTypeSchema;
};
