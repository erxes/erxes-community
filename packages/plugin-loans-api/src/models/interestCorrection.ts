import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';
import {
  IInterestCorrection,
  IInterestCorrectionDocument,
  InterestCorrectionSchema
} from './definitions/interestCorrection';

export const loanInterestCorrectionClass = (models: IModels) => {
  class InterestCorrection {
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
  InterestCorrectionSchema.loadClass(InterestCorrection);
  return InterestCorrectionSchema;
};

export interface IInterestCorrectionModel
  extends Model<IInterestCorrectionDocument> {
  createInterestCorrection(interestCorrection: IInterestCorrection);
  getInterestCorrection(_id: string);
  updateInterestCorrection(_id, interestCorrection: IInterestCorrection);
}
