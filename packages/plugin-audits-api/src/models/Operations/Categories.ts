import { Model } from 'mongoose';
import { IOperationCategoriesDocument } from '../../common/types/riskAssessment';
import { IModels } from '../../connectionResolver';
import { operationCategoriesSchema } from '../definitions/operations';
export interface IOperationCategoriesModel extends Model<IOperationCategoriesDocument> {
  categoryAdd(doc: any): Promise<IOperationCategoriesDocument>;
  categoryEdit(_id: string, doc: any): Promise<IOperationCategoriesDocument>;
  categoriesRemove(_ids: string[]): Promise<IOperationCategoriesDocument>;
}

export const loadOperationCategories = (models: IModels, subdomain: string) => {
  class OperationCategories {
    public static async categoryAdd(doc: any) {
      return models.OperationCategories.create({ ...doc });
    }
    public static async categoryEdit(_id: string, doc: any) {
      return 'updated';
    }
    public static async categoriesRemove(_ids: string[]) {
      return 'removed';
    }
  }

  operationCategoriesSchema.loadClass(OperationCategories);
  return operationCategoriesSchema;
};
