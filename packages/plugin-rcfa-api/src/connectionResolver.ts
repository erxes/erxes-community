import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import * as mongoose from 'mongoose';
import {
  IRCFAQuestionModel,
  loadRCFAQuestionClass
} from './models/rcfaQuestionModel';
import { IRCFAModel, loadRCFAClass } from './models/rcfaModel';
import { IRCFAQuestionsDocument } from './models/definitions/question';
import { IRCFADocument } from './models/definitions/rcfa';

export interface IModels {
  RCFAQuestions: IRCFAQuestionModel;
  RCFA: IRCFAModel;
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

  models.RCFA = db.model<IRCFADocument, IRCFAModel>(
    'rcfa',
    loadRCFAClass(models, subdomain)
  );

  models.RCFAQuestions = db.model<IRCFAQuestionsDocument, IRCFAQuestionModel>(
    'rcfa_questions',
    loadRCFAQuestionClass(models, subdomain)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
