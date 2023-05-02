import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import * as mongoose from 'mongoose';

import {
  IKhanbankAccountConfigModel,
  loadKhanbankAccountClass
} from './models/KhanbankAccounts';
import {
  IKhanbankConfigModel,
  loadKhanbankConfigClass
} from './models/KhanbankConfigs';
import { IKhanbankAccountConfigDocument } from './models/definitions/khanbankAccounts';
import { IKhanbankConfigDocument } from './models/definitions/khanbankConfigs';

export interface IModels {
  KhanbankConfigs: IKhanbankConfigModel;
  KhanbankAccounts: IKhanbankAccountConfigModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (db: mongoose.Connection): IModels => {
  models = {} as IModels;

  models.KhanbankConfigs = db.model<
    IKhanbankConfigDocument,
    IKhanbankConfigModel
  >('khanbank_configs', loadKhanbankConfigClass(models));

  models.KhanbankAccounts = db.model<
    IKhanbankAccountConfigDocument,
    IKhanbankAccountConfigModel
  >('khanbank_accounts', loadKhanbankAccountClass(models));

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
