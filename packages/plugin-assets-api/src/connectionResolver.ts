import * as mongoose from 'mongoose';
import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import {
  IAssetsModel,
  IAssetsCategoryModel,
  loadAssetsCategoryClass,
  loadAssetsClass
} from './models/Template';
import {
  IAssetsCategoryDocument,
  IAssetsDocument
} from './models/definitions/assets';

export interface IModels {
  assets: IAssetsModel;
  assetsCategory: IAssetsCategoryModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (db: mongoose.Connection): IModels => {
  models = {} as IModels;

  models.assets = db.model<IAssetsDocument, IAssetsModel>(
    'assets',
    loadAssetsClass(models)
  );

  models.assetsCategory = db.model<
    IAssetsCategoryDocument,
    IAssetsCategoryModel
  >('asset_categories', loadAssetsCategoryClass(models));

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
