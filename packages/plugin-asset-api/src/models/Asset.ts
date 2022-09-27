import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';
import { assetSchema, IAssetDocument } from './definitions/asset';
export interface IAssetModel extends Model<IAssetDocument> {}

export const loadAssetClass = (model: IModels) => {
  class Asset {}

  assetSchema.loadAssetClass(Asset);
  return assetSchema;
};
