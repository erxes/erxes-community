import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';
import {
  IClassification,
  IClassificationDocument,
  classificationSchema
} from './definitions/classification';
import {
  IInterestCorrection,
  IInterestCorrectionDocument
} from './definitions/interestCorrection';

export const loanInterestCorrectionClass = (models: IModels) => {
  class Classification {
    public static async createInterestCorrection(
      interestCorrection: IInterestCorrection
    ) {
      var res = await models.InterestCorrection.create(interestCorrection);

      return res;
    }

    public static async getInterestCorrection(_id: string) {
      var res = await models.InterestCorrection.findOne({ _id }).lean();

      return res;
    }

    public static async updateInterestCorrection(
      _id: string,
      interestCorrection: IInterestCorrection
    ) {
      var res = await models.InterestCorrection.updateOne(
        { _id },
        { $set: interestCorrection }
      );

      return res;
    }
  }
  classificationSchema.loadClass(Classification);
  return classificationSchema;
};

export interface IInterestCorrectionModel
  extends Model<IInterestCorrectionDocument> {
  createClassification(classification: IClassification);
  getClassification(_id: string);
  updateClassification(_id, classification: IClassification);
}
