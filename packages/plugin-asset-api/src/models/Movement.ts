import { Model } from 'mongoose';
import { IMovementDocument } from '../common/types/asset';
import { IModels } from '../connectionResolver';
import { assetMovementSchema } from './definitions/movements';

export interface IMovementModel extends Model<IMovementDocument> {
  movementAdd(doc: any): Promise<IMovementDocument>;
  movementEdit(id: string, doc: any): Promise<IMovementDocument>;
}

export const loadMovementClass = (models: IModels) => {
  class Movement {
    public static async movementAdd(doc: any) {
      return 'added';
    }
    public static async movementEdit(id: string, doc: any) {
      return 'edited';
    }
  }

  assetMovementSchema.loadClass(Movement);

  return assetMovementSchema;
};
