import { Model } from 'mongoose';
import {
  IConversationDocument,
  conversationSchema
} from './definitions/ConversationDefinition';
import { IModels } from '../connectionResolver';

export interface IConversation extends Model<IConversationDocument> {}

export const loadConversationClass = (models: IModels, subdomain: string) => {
  class Conversation {}
  conversationSchema.loadClass(Conversation);
  return conversationSchema;
};
