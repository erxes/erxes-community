import { Schema, Document } from 'mongoose';

export interface IConversation {
  erxesApiId?: string;
  timestamp: Date;
  senderId: string;
  recipientId?: string;
  integrationId: string;
}

export interface IConversationDocument extends Document {
  _id: string;
}

export const conversationSchema: Schema<IConversation> = new Schema<
  IConversation
>({
  erxesApiId: String,
  timestamp: Date,
  senderId: { type: String, index: true },
  recipientId: { type: String, index: true, required: false },
  integrationId: String
});

conversationSchema.index({ senderId: 1, recipientId: 1 }, { unique: true });
