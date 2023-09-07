import * as mongoose from 'mongoose';

import { IContext as IMainContext } from '@erxes/api-utils/src/types';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import { IIntegrationModel, loadIntegrationClass } from './models/Integrations';
import { IIntegrationDocument } from './models/definitions/integrations';
import { ICallsModel, loadCallsClass } from './models/Calls';
import { ICallsDocument } from './models/definitions/calls';

export interface IModels {
  Integrations: IIntegrationModel;
  Calls: ICallsModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (db: mongoose.Connection): IModels => {
  models = {} as IModels;

  models.Integrations = db.model<IIntegrationDocument, IIntegrationModel>(
    'integrations',
    loadIntegrationClass(models)
  );

  models.Calls = db.model<ICallsDocument, ICallsModel>(
    'calls',
    loadCallsClass(models)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
