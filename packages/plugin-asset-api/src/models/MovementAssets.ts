import { Model } from 'mongoose';

import { IMovementAssetDocument } from '../common/types/asset';
import { IModels } from '../connectionResolver';
import { movementAssetsSchema } from './definitions/movements';

export interface IMovementAssetModel extends Model<IMovementAssetDocument> {
  movementAssetsAdd(assets: any): Promise<IMovementAssetDocument[]>;
}

export const loadMovementAssetClass = (models: IModels) => {
  class MovementAsset {
    public static async movementAssetsAdd(assets: any) {
      for (const asset of assets) {
        await models.Asset.findByIdAndUpdate(asset.assetId, {
          $set: { currentMovement: { ...asset, assetId: undefined, assetName: undefined } }
        });
      }
      return models.MovementAsset.insertMany(assets, { ordered: false });
    }
  }

  movementAssetsSchema.loadClass(MovementAsset);
  return movementAssetsSchema;
};
