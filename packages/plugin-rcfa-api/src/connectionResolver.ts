import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import * as mongoose from 'mongoose';
import { IRCFAModel, loadRCFAClass } from './models/RCFA';
import { IRCFAQuestionsDocument } from './models/definitions/rcfa';

export interface IModels {
  RCFAQuestions: IRCFAModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string
): IModels => {
  models = {} as IModels;

  models.RCFAQuestions = db.model<IRCFAQuestionsDocument, IRCFAModel>(
    'rcfa_questions',
    loadRCFAClass(models, subdomain)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
