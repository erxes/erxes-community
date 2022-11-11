import { Document, Schema } from 'mongoose';
import { field } from '../utils';

export interface ICustomer {
  // id on erxes-api
  erxesApiId?: string;
  userId: string;
  integrationId: string;
  name: string;
  screenName: string;
  profilePic;
  string;
}

export interface ICustomerDocument extends ICustomer, Document {}

export const customerSchema = new Schema({
  _id: field({ pkey: true }),
  userId: { type: String, unique: true },
  // not integrationId on erxes-api
  integrationId: String,
  erxesApiId: String,

  name: String,
  screenName: String,
  profilePic: String
});

export interface IConversation {
  // id on erxes-api
  erxesApiId?: string;
  timestamp: Date;
  senderId: string;
  receiverId: string;
  content: string;
  integrationId: string;
}

export interface IConversationDocument extends IConversation, Document {}

export const conversationSchema = new Schema({
  _id: field({ pkey: true }),
  erxesApiId: String,
  timestamp: Date,
  senderId: { type: String, index: true },
  receiverId: { type: String, index: true },
  integrationId: String,
  content: String
});

conversationSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

export interface IConversationMessage {
  messageId: string;
  conversationId: string;
  content: string;
}

export interface IConversationMessageDocument
  extends IConversationMessage,
    Document {}

export const conversationMessageSchema = new Schema({
  _id: field({ pkey: true }),
  messageId: { type: String, unique: true },
  conversationId: String,
  content: String
});

export interface IIntegration {
  kind: string;
  name: string;
  brandId: string;
  channelIds: [string];
  accountId: string;
  erxesApiId: string;
  email: string;
  phoneNumber: string;
  recordUrl: string;
  expiration?: string;
  healthStatus?: string;
  error?: string;
}

export interface IIntegrationDocument extends IIntegration, Document {}

// schema for integration document
export const integrationSchema = new Schema({
  _id: field({ pkey: true }),
  kind: String,
  name: String,
  brandId: String,
  channelIds: [String],
  accountId: String,
  erxesApiId: String,
  phoneNumber: field({
    type: String,
    label: 'CallPro phone number',
    optional: true
  }),
  recordUrl: field({
    type: String,
    label: 'CallPro record url',
    optional: true
  }),
  email: String,
  expiration: String,
  healthStatus: String,
  error: String
});

export interface IConfig {
  code: string;
  value: any;
}

export interface IConfigDocument extends IConfig, Document {
  _id: string;
}

// Mongoose schemas ===========

export const configSchema = new Schema({
  _id: field({ pkey: true }),
  code: field({ type: String, unique: true }),
  value: field({ type: Object })
});
