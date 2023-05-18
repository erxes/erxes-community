import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import * as mongoose from 'mongoose';
import { IRCFAQuestionModel, loadRCFAClass } from './models/rcfaQuestionModel';
import { IRCFAQuestionsDocument } from './models/definitions/question';

export interface IModels {
  RCFAQuestions: IRCFAQuestionModel;
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

  models.RCFAQuestions = db.model<IRCFAQuestionsDocument, IRCFAQuestionModel>(
    'rcfa_questions',
    loadRCFAClass(models, subdomain)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
