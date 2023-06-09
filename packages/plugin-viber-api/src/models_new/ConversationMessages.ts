import { Model } from 'mongoose';
import {
  IConversationMessagesDocument,
  conversationMessageSchema
} from './definitions/ConversationMessageDefinition';
import { IModels } from '../connectionResolver';

export interface IConversationMessage
  extends Model<IConversationMessagesDocument> {}

export const loadConversationMessageClass = (
  models: IModels,
  subdomain: string
) => {
  class ConversationMessages {}
  conversationMessageSchema.loadClass(ConversationMessages);
  return conversationMessageSchema;
};
