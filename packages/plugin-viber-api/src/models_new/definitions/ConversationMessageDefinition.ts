import { Schema, Document } from 'mongoose';

export interface IConversationMessages extends Document {
  conversationId: string;
  userId: string;
  customerId: string;
  createdAt: Date;
  content: string;
  messageType: string;
}

export interface IConversationMessagesDocument extends Document {
  _id: string;
}

export const conversationMessageSchema: Schema<IConversationMessages> = new Schema<
  IConversationMessages
>({
  conversationId: String,
  userId: String,
  customerId: String,
  createdAt: Date,
  content: String,
  messageType: String
});
