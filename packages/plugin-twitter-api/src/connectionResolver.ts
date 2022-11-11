import { IConfigDocument } from './../../core/src/db/models/definitions/configs';
import * as mongoose from 'mongoose';
import { IContext as IMainContext } from '@erxes/api-utils/src';
import {
  ICustomerDocument,
  IConversationDocument,
  IConversationMessageDocument,
  IIntegrationDocument
} from './models/definitions/twitter';
import {
  ICustomerModel,
  IConversationModel,
  IConversationMessageModel,
  IIntegrationModel,
  IConfigModel,
  loadCustomerClass,
  loadConversationClass,
  loadConversationMessageClass,
  loadIntegrationClass,
  loadConfigClass
} from './models/Twitter';
import { createGenerateModels } from '@erxes/api-utils/src/core';

export interface IModels {
  Customers: ICustomerModel;
  Conversations: IConversationModel;
  ConversationMessages: IConversationMessageModel;
  Integrations: IIntegrationModel;
  Configs: IConfigModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (
  db: mongoose.Connection,
  _subdomain: string
): IModels => {
  models = {} as IModels;

  models.Customers = db.model<ICustomerDocument, ICustomerModel>(
    'twitter_customers',
    loadCustomerClass()
  );

  models.Conversations = db.model<IConversationDocument, IConversationModel>(
    'twitter_conversations',
    loadConversationClass(models)
  );

  models.ConversationMessages = db.model<
    IConversationMessageDocument,
    IConversationMessageModel
  >('twitter_messages_conversations', loadConversationMessageClass(models));

  models.Integrations = db.model<IIntegrationDocument, IIntegrationModel>(
    'twitter_integrations',
    loadIntegrationClass(models)
  );

  models.Configs = db.model<IConfigDocument, IConfigModel>(
    'twitter_configs',
    loadConfigClass(models)
  );

  return models;
};
export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
