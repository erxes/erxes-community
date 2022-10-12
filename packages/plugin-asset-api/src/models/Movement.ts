import { Model } from 'mongoose';
import { IMovementDocument } from '../common/types/asset';
import { IModels } from '../connectionResolver';
import { movementSchema } from './definitions/movements';

export interface IMovementModel extends Model<IMovementDocument> {
  movements(params: any): Promise<IMovementDocument[]>;
  movementAdd(doc: any, userId: string): Promise<IMovementDocument>;
  movementRemove(): Promise<IMovementDocument>;
}

export const loadMovementClass = (models: IModels) => {
  class Movement {
    public static async movements(params) {
      return models.Movement.find();
    }

    public static async movementAdd(doc: any, userId: string) {
      if (!doc.movements) {
        throw new Error('No assets in  movement ');
      }

      if (!doc.description) {
        throw new Error('No description in movement ');
      }

      if (!doc.movedAt) {
        throw new Error('No moved date in movement ');
      }

      const addedAssets = await models.MovementAsset.movementAssetsAdd(doc.movements);

      const movementAssetIds = addedAssets.map(asset => asset._id);

      return models.Movement.create({
        assetIds: movementAssetIds,
        movedAt: doc.movedAt,
        description: doc.description,
        userId
      });
    }
    public static async movementRemove() {
      try {
        const movement = await models.Movement.findOne()
          .sort({ createdAt: 1 })
          .limit(1);

        if (!movement) {
          throw new Error('Movement not found');
        }

        const items = await models.MovementAsset.find({ _id: { $in: movement.assetIds } });
        const assetIds = items.map(item => item.assetId);

        await models.Asset.updateMany(
          { _id: { $in: assetIds } },
          { $set: { currentMovement: undefined } }
        );

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
