import { Model } from 'mongoose';
import { IOperationCategoriesDocument } from '../../common/types/riskAssessment';
import { IModels } from '../../connectionResolver';
import { operationCategoriesSchema } from '../definitions/operations';
export interface IOperationCategoriesModel extends Model<IOperationCategoriesDocument> {
  categoryAdd(doc: any): Promise<IOperationCategoriesDocument>;
  categoryEdit(_id: string, doc: any): Promise<IOperationCategoriesDocument>;
  categoryRemove(_ids: string): Promise<IOperationCategoriesDocument>;
}

export const loadOperationCategories = (models: IModels, subdomain: string) => {
  class OperationCategories {
    public static async categoryAdd(doc: any) {
      return models.OperationCategories.create({ ...doc });
    }
    public static async categoryEdit(_id: string, doc: any) {
      return 'updated';
    }
    public static async categoryRemove(_id: string) {
      await models.OperationCategories.findByIdAndDelete({ _id });
      return 'removed';
    }
  }

  operationCategoriesSchema.loadClass(OperationCategories);
  return operationCategoriesSchema;
};
