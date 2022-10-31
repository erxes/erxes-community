import { Model } from 'mongoose';
import { IOperationsDocument } from '../../common/types/riskAssessment';
import { IModels } from '../../connectionResolver';
import { operationsSchema } from '../definitions/operations';
export interface IOperationsModel extends Model<IOperationsDocument> {
  operationAdd(doc: any): Promise<IOperationsDocument>;
  operationEdit(_id: string, doc: any): Promise<IOperationsDocument>;
  operationsRemove(_ids: string[]): Promise<IOperationsDocument>;
}

export const loadOperations = (models: IModels, subdomain: string) => {
  class Operations {
    public static async operationAdd(doc: any) {
      const { parentId, code, name } = doc;
      const order = this.getOrder(parentId, code, name);
      await models.Operations.create({ ...doc, order });
      return 'added';
    }
    public static async operationEdit(_id: string, doc: any) {
      return 'updated';
    }
    public static async operationsRemove(_ids: string[]) {
      return 'removed';
    }
    static async getOrder(_id: string, code: string, name: string) {
      const parent = await models.Operations.findOne({ _id });
      return parent ? `${parent.order}/${code}` : `${name}${code}`;
    }
  }

  operationsSchema.loadClass(Operations);
  return operationsSchema;
};
