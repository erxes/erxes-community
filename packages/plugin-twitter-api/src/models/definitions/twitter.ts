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

export interface IAccount {
  kind: string;
  email: string;
  username?: string;
  host: string;
  password: string;
  imapHost: string;
  smtpHost: string;
  imapPort: number;
  smtpPort: number;
  nylasToken: string;
  nylasTokenSecret: string;
  token: string;
  tokenSecret?: string;
  expireDate?: string;
  scope?: string;
  name: string;
  billingState?: string;
  uid: string;
  googleAccessToken?: string;
  nylasAccountId?: string;
  nylasBillingState?: string;
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
  host: {
    type: String
  },
  imapHost: {
    type: String
  },
  smtpHost: {
    type: String
  },
  imapPort: {
    type: Number
  },
  smtpPort: {
    type: Number
  },
  password: {
    type: String,
    optional: true
  },
  googleAccessToken: {
    type: String,
    optional: true
  },
  nylasToken: {
    type: String
  },
  nylasTokenSecret: {
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
  uid: { type: String },
  nylasAccountId: {
    type: String,
    optional: true
  },
  nylasBillingState: {
    type: String,
    optional: true
  }
});

export interface IIntegration {
  kind: string;
  accountId: string;
  emailScope?: string;
  nylasToken?: string;
  nylasAccountId?: string;
  nylasBillingState?: string;
  erxesApiId: string;
  facebookPageIds?: string[];
  facebookPageTokensMap?: { [key: string]: string };
  email: string;
  googleAccessToken?: string;
  phoneNumber: string;
  recordUrl: string;
  expiration?: string;
  gmailHistoryId?: string;
  chatfuelConfigs?: { [key: string]: string };
  telegramBotToken?: string;
  viberBotToken?: string;
  lineChannelId?: string;
  lineChannelSecret?: string;
  twilioSid?: string;
  twilioAuthToken?: string;
  twilioPhoneSid?: string;
  smoochDisplayName?: string;
  smoochIntegrationId?: string;
  whatsappinstanceId?: string;
  whatsappToken?: string;
  telnyxPhoneNumber?: string;
  telnyxProfileId?: string;
  healthStatus?: string;
  error?: string;
}

export interface IIntegrationDocument extends IIntegration, Document {}

// schema for integration document
export const integrationSchema = new Schema({
  _id: field({ pkey: true }),
  kind: String,
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
  emailScope: String,
  googleAccessToken: field({
    type: String,
    optional: true
  }),
  nylasToken: String,
  nylasAccountId: String,
  nylasBillingState: String,
  facebookPageIds: field({
    type: [String],
    label: 'Facebook page ids',
    optional: true
  }),
  email: String,
  expiration: String,
  gmailHistoryId: String,
  facebookPageTokensMap: field({
    type: Object,
    default: {}
  }),
  chatfuelConfigs: field({
    type: Object,
    default: {}
  }),
  telegramBotToken: String,
  viberBotToken: String,
  lineChannelId: String,
  lineChannelSecret: String,
  twilioSid: String,
  twilioAuthToken: String,
  twilioPhoneSid: String,
  smoochDisplayName: String,
  smoochIntegrationId: String,
  whatsappinstanceId: String,
  whatsappToken: String,
  telnyxPhoneNumber: field({ type: String, label: 'Telnyx phone number' }),
  telnyxProfileId: field({
    type: String,
    label: 'Telnyx messaging profile id'
  }),
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
