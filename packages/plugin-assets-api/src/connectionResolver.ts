import * as mongoose from 'mongoose';
import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import {
  IAssetDocument,
  IAssetCategoriesDocument,
  IMovementItemDocument,
  IMovementDocument
} from './common/types/asset';
import { IAssetCategoriesModel, loadAssetCategoriesClass } from './models/AssetCategories';
import { IAssetModel, loadAssetClass } from './models/Asset';
import { IMovementModel, loadMovementClass } from './models/Movement';
import { IMovementItemModel, loadMovementItemClass } from './models/MovementItems';

export interface IModels {
  Asset: IAssetModel;
  AssetCategories: IAssetCategoriesModel;
  Movement: IMovementModel;
  MovementItems: IMovementItemModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (db: mongoose.Connection, subdomain: string): IModels => {
  models = {} as IModels;

  models.Asset = db.model<IAssetDocument, IAssetModel>('asset', loadAssetClass(models, subdomain));
  models.AssetCategories = db.model<IAssetCategoriesDocument, IAssetCategoriesModel>(
    'asset_categories',
    loadAssetCategoriesClass(models)
  );
  models.Movement = db.model<IMovementDocument, IMovementModel>(
    'asset_movement',
    loadMovementClass(models)
  );
  models.MovementItems = db.model<IMovementItemDocument, IMovementItemModel>(
    'asset_movement_items',
    loadMovementItemClass(models)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(models, loadClasses);
