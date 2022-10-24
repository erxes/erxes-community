import { IConfigDocument } from './../../core/src/db/models/definitions/configs';
import * as mongoose from 'mongoose';
import { IContext as IMainContext } from '@erxes/api-utils/src';
import {
  ICustomerDocument,
  IConversationDocument,
  IConversationMessageDocument,
  IAccountDocument,
  IIntegrationDocument
} from './models/definitions/twitter';
import {
  ICustomerModel,
  IConversationModel,
  IConversationMessageModel,
  IAccountModel,
  IIntegrationModel,
  IConfigModel,
  loadCustomerClass,
  loadConversationClass,
  loadConversationMessageClass,
  loadAccountClass,
  loadIntegrationClass,
  loadConfigClass
} from './models/Twitter';

export interface IModels {
  Customers: ICustomerModel;
  Conversations: IConversationModel;
  ConversationMessages: IConversationMessageModel;
  Accounts: IAccountModel;
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
    'customers_twitter',
    loadCustomerClass(models)
  );

  models.Conversations = db.model<IConversationDocument, IConversationModel>(
    'conversations_twitter',
    loadConversationClass(models)
  );

  models.ConversationMessages = db.model<
    IConversationMessageDocument,
    IConversationMessageModel
  >('conversation_messages_twitters', loadConversationMessageClass(models));

  models.Accounts = db.model<IAccountDocument, IAccountModel>(
    'twitter_account',
    loadAccountClass(models)
  );

  models.Integrations = db.model<IIntegrationDocument, IIntegrationModel>(
    'twitter_integration',
    loadIntegrationClass(models)
  );

  models.Configs = db.model<IConfigDocument, IConfigModel>(
    'twitter_config',
    loadConfigClass(models)
  );

  return models;
};
