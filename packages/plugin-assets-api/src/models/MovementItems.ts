import { Model } from 'mongoose';

import { IMovementItem, IMovementItemDocument } from '../common/types/asset';
import { IModels } from '../connectionResolver';
import { movementItemsSchema } from './definitions/movements';

export interface IMovementItemModel extends Model<IMovementItemDocument> {
  movementItemsAdd(assets: any): Promise<IMovementItemDocument[]>;
  movementItemsEdit(movementId: string, items: any[]): Promise<IMovementItemDocument[]>;
}

export const loadMovementItemClass = (models: IModels) => {
  class MovementItem {
    public static async movementItemsAdd(assets: any[]) {
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

      return models.MovementItems.insertMany(assets);
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
        const movementItems = await models.MovementItems.findOneAndUpdate(
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

  movementItemsSchema.loadClass(MovementItem);
  return movementItemsSchema;
};
