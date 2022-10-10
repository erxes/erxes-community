import { Model } from 'mongoose';
import { IMovementDocument } from '../common/types/asset';
import { IModels } from '../connectionResolver';
import { movementSchema } from './definitions/movements';

export interface IMovementModel extends Model<IMovementDocument> {
  movements(params: any): Promise<IMovementDocument[]>;
  movementAdd(movements: any): Promise<IMovementDocument>;
  movementRemove(): Promise<IMovementDocument>;
}

export const loadMovementClass = (models: IModels) => {
  class Movement {
    public static async movements(params) {
      return models.Movement.find();
    }

    public static async movementAdd(movements: any) {
      const addedAssets = await models.MovementAsset.movementAssetsAdd(movements);

      const movementAssetIds = addedAssets.map(asset => asset._id);

      return models.Movement.create({ assetIds: movementAssetIds });
    }
    public static async movementRemove() {
      try {
        const movement = await models.Movement.findOne()
          .sort({ createdAt: 1 })
          .limit(1);

        if (!movement) {
          throw new Error('Movement not found');
        }

        await models.MovementAsset.deleteMany({ _id: { $in: movement.assetIds } });

        await models.Movement.remove({ _id: movement._id });
      } catch (error) {
        throw new Error(error.message);
      }

      return { status: 'removed' };
    }
  }

  movementSchema.loadClass(Movement);

  return movementSchema;
};
