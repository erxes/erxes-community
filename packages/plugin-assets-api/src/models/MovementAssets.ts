import { Model } from 'mongoose';

import { IMovementAssetDocument } from '../common/types/asset';
import { IModels } from '../connectionResolver';
import { movementAssetsSchema } from './definitions/movements';

export interface IMovementAssetModel extends Model<IMovementAssetDocument> {
  movementAssetsAdd(assets: any): Promise<IMovementAssetDocument[]>;
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
  }

  movementAssetsSchema.loadClass(MovementAsset);
  return movementAssetsSchema;
};
