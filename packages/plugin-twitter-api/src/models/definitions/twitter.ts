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
  conversationId: string;
}

export interface IConversationDocument extends IConversation, Document {}

export interface IConversationMessage {
  messageId: number;
  conversationId: string;
  content: string;
  timestamp: Date;
  senderId: string;
  receiverId: string;
}

export interface IConversationMessageDocument
  extends IConversationMessage,
    Document {}

export const conversationMessageSchema = new Schema({
  _id: field({ pkey: true }),
  messageId: { type: Number, unique: true },
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
  token: string;
  tokenSecret?: string;
  name: string;
  kind: string;
  uid: string;
}

export interface IAccountDocument extends IAccount, Document {}

export const accountSchema = new Schema({
  _id: field({ pkey: true }),

  token: {
    type: String
  },
  tokenSecret: {
    type: String,
    optional: true
  },
  name: { type: String },
  kind: {
    type: String
  },
  uid: { type: String }
});
// Mongoose schemas ===========

export const configSchema = new Schema({
  _id: field({ pkey: true }),
  code: field({ type: String, unique: true }),
  value: field({ type: Object })
});
export interface IMessageDocument extends IMessage, Document {}

export interface ITweetDocument extends ITweet, Document {}

export interface ITweet {
  tweetId: string;
  content: string;
  createdAt: Date;
  userId: string;
  erxesApiId?: string;
}

export interface IMessage {
  inboxIntegrationId: string;
  inboxConversationId: string;
  messageId: string;
  senderId: string;
  content: string;
  receiverId: string;
  createdAt: Date;
}

export const attachmentSchema = new Schema(
  {
    filename: String,
    mimeType: String,
    size: Number,
    attachmentId: String
  },
  { _id: false }
);

export const messageSchema = new Schema({
  inboxIntegrationId: String,
  inboxConversationId: String,
  messageId: { type: String, unique: true },
  senderId: String,
  content: String,
  receiverId: String,
  createdAt: Date
});

export const tweetSchema = new Schema({
  tweetId: { type: String, unique: true },
  content: String,
  createdAt: Date,
  userId: String,
  erxesApiId: String
});
