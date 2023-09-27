import * as mongoose from 'mongoose';
import { IContext as IMainContext } from '@erxes/api-utils/src';
import {
  IAssetCategoryModel,
  IAssetModel,
  loadAssetCategoryClass,
  loadAssetClass
} from './models/Assets';
import { IAssetCategoryDocument, IAssetDocument } from './models/definitions/assets';
import { IUomModel, loadUomClass } from './models/Uoms';
import { IUomDocument } from './models/definitions/uoms';
import { IAssetsConfigDocument } from './models/definitions/configs';
import { IAssetsConfigModel, loadAssetsConfigClass } from './models/Configs';
import { createGenerateModels } from '@erxes/api-utils/src/core';
export interface IModels {
  Assets: IAssetModel;
  AssetCategories: IAssetCategoryModel;
  AssetsConfigs: IAssetsConfigModel;
  Uoms: IUomModel;
}
export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (db: mongoose.Connection, subdomain: string): IModels => {
  models = {} as IModels;

  models.Assets = db.model<IAssetDocument, IAssetModel>(
    'assets',
    loadAssetClass(models, subdomain)
  );
  models.Uoms = db.model<IUomDocument, IUomModel>('uoms', loadUomClass(models, subdomain));
  models.AssetsConfigs = db.model<IAssetsConfigDocument, IAssetsConfigModel>(
    'assets_configs',
    loadAssetsConfigClass(models)
  );
  models.AssetCategories = db.model<IAssetCategoryDocument, IAssetCategoryModel>(
    'asset_categories',
    loadAssetCategoryClass(models)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(models, loadClasses);
