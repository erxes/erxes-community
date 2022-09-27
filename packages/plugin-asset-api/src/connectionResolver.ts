import * as mongoose from 'mongoose';
import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import { IAssetDocument, IAssetGroupDocument } from './models/definitions/asset';
import { IAssetGroupModel, loadAssetGroupClass } from './models/AssetGroup';
import { IAssetModel, loadAssetClass } from './models/Asset';

export interface IModels {
  Asset: IAssetModel;
  AssetGroup: IAssetGroupModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (db: mongoose.Connection): IModels => {
  models = {} as IModels;

  models.Asset = db.model<IAssetDocument, IAssetModel>('asset', loadAssetClass(models));
  models.AssetGroup = db.model<IAssetGroupDocument, IAssetGroupModel>('asset_group', loadAssetGroupClass(models));

  return models;
};

export const generateModels = createGenerateModels<IModels>(models, loadClasses);
