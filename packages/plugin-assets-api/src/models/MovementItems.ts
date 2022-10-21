import { Model } from 'mongoose';

import { IMovementItemDocument } from '../common/types/asset';
import { IModels } from '../connectionResolver';
import { movementItemsSchema } from './definitions/movements';

export interface IMovementItemModel extends Model<IMovementItemDocument> {
  movementItemsAdd(assets: any): Promise<IMovementItemDocument[]>;
  movementItemsEdit(movementId: string, items: any[]): Promise<IMovementItemDocument[]>;
  movementItemsCurrentLocations(assetIds: string[]): Promise<IMovementItemDocument[]>;
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
        const sourceLocations = await models.MovementItems.findOne({ assetId: asset.assetId })
          .sort({ createdAt: -1 })
          .limit(1);
        asset.sourceLocations = sourceLocations || {};
        asset.createdAt = new Date();
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
      }
      await models.Movements.update({ _id: movementId }, { $set: { itemIds: movementItemIds } });
    }

    public static async movementItemsCurrentLocations(assetIds: string[]) {
      const items: any[] = [];
      for (const assetId of assetIds) {
        const asset = await models.MovementItems.findOne({ assetId })
          .sort({ createdAt: -1 })
          .limit(1);
        if (asset) {
          items.push(asset);
        }
      }
      return items;
    }
  }

  movementItemsSchema.loadClass(MovementItem);
  return movementItemsSchema;
};
