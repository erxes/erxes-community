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
  timestamp: Date;
}

export interface IConversationMessageDocument
  extends IConversationMessage,
    Document {}

export const conversationMessageSchema = new Schema({
  _id: field({ pkey: true }),
  messageId: { type: String, unique: true },
  conversationId: String,
  content: String,
  timestamp: Date
});

export interface IIntegration {
  inboxId: string;
  name: string;
  accountId: string;
}

export interface IIntegrationDocument extends IIntegration, Document {}

// schema for integration document
export const integrationSchema = new Schema({
  inboxId: String,
  name: String,
  accountId: String
});

export interface IConfig {
  code: string;
  value: any;
}

export interface IConfigDocument extends IConfig, Document {
  _id: string;
}

export interface IAccount {
  kind: string;
  email: string;
  username?: string;
  token: string;
  tokenSecret?: string;
  expireDate?: string;
  scope?: string;
  name: string;
  billingState?: string;
  uid: string;
}

export interface IAccountDocument extends IAccount, Document {}

export const accountSchema = new Schema({
  _id: field({ pkey: true }),
  kind: {
    type: String
  },
  billingState: {
    type: String,
    optional: true
  },
  email: {
    type: String
  },
  username: {
    type: String,
    optional: true
  },
  token: {
    type: String
  },
  tokenSecret: {
    type: String,
    optional: true
  },
  scope: {
    type: String,
    optional: true
  },
  expireDate: {
    type: String,
    optional: true
  },
  name: { type: String },
  uid: { type: String }
});
// Mongoose schemas ===========

export const configSchema = new Schema({
  _id: field({ pkey: true }),
  code: field({ type: String, unique: true }),
  value: field({ type: Object })
});
