import { Model } from 'mongoose';

import { IMovementAsset, IMovementAssetDocument } from '../common/types/asset';
import { IModels } from '../connectionResolver';
import { movementAssetsSchema } from './definitions/movements';

export interface IMovementAssetModel extends Model<IMovementAssetDocument> {
  movementAssetsAdd(assets: any): Promise<IMovementAssetDocument[]>;
  movementItemsEdit(movementId: string, items: any[]): Promise<IMovementAssetDocument[]>;
}

export const loadMovementAssetClass = (models: IModels) => {
  class MovementAsset {
    public static async movementAssetsAdd(assets: any[]) {
      for (const asset of assets) {
        const newAsset = Object.assign(
          {},
          { ...asset },
          { assetId: undefined, assetName: undefined }
        );
        if (Object.values(newAsset).every(item => !item)) {
          throw new Error('You should provide at least one field');
        }
        await models.Asset.findByIdAndUpdate(asset.assetId, {
          $set: { currentMovement: { ...newAsset } }
        });
      }

      return models.MovementAsset.insertMany(assets);
    }
    public static async movementItemsEdit(movementId: string, items: any[]) {
      const movementItemIds: string[] = [];
      for (const item of items) {
        const newItem = Object.assign(
          {},
          { ...item },
          { assetId: undefined, assetName: undefined }
        );
        if (Object.values(newItem).every(item => !item)) {
          throw new Error('You should provide at least one field');
        }
        const movementItems = await models.MovementAsset.findOneAndUpdate(
          { assetId: item.assetId },
          { ...item, movementId },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          }
        );

        movementItemIds.push(movementItems._id);

        await models.Asset.findByIdAndUpdate(item.assetId, {
          $set: { currentMovement: { ...newItem } }
        });
      }
      await models.Movement.update({ _id: movementId }, { $set: { assetIds: movementItemIds } });
    }
  }

  movementAssetsSchema.loadClass(MovementAsset);
  return movementAssetsSchema;
};
