import * as mongoose from 'mongoose';
import { mainDb } from './configs';
import { IContext as IMainContext } from '@erxes/api-utils/src';
import {
  IChatMessageDocument,
  IChatDocument,
  IUserStatusDocument
} from './models/definitions/chat'; // IChatMessageDocument  IChatDocument
import {
  loadChatClass, // loadChatClass
  loadChatMessageClass, // loadChatMessageClass
  IChatModel, // IChatModel
  IChatMessageModel, // IChatMessageModel
  IUserStatusModel,
  loadUserStatusClass
} from './models/chat';
import { MongoClient } from 'mongodb';

export interface IModels {
  ChatMessages: IChatMessageModel;
  Chats: IChatModel;
  UserStatus: IUserStatusModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels;

export const generateModels = async (
  _hostnameOrSubdomain: string
): Promise<IModels> => {
  if (models) {
    return models;
  }

  loadClasses(mainDb);

  return models;
};

export const loadClasses = (db: mongoose.Connection): IModels => {
  models = {} as IModels;

  models.ChatMessages = db.model<IChatMessageDocument, IChatMessageModel>(
    'chat-message',
    loadChatMessageClass(models)
  );

  models.Chats = db.model<IChatDocument, IChatModel>(
    'chat',
    loadChatClass(models)
  );
  models.UserStatus = db.model<IUserStatusDocument, IUserStatusModel>(
    'chat-user-status',
    loadUserStatusClass(models)
  );
  return models;
};
