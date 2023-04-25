import { Schema, model, Document, Model } from 'mongoose';
// import { IModels } from '../connectionResolver';

export const customerSchema = new Schema({
  inboxIntegrationId: String,
  contactsId: String,
  viberId: { type: String },
  name: String,
  country: String
});

export const loadCustomerClass = () => {
  class Customer {}
  customerSchema.loadClass(Customer);
  return customerSchema;
};

export const Customers = model<any, any>(
  'viber_customers',
  loadCustomerClass()
);

const emailSchema = new Schema(
  {
    name: String,
    address: String
  },
  { _id: false }
);

export const messageSchema = new Schema({
  inboxIntegrationId: String,
  inboxConversationId: String,
  messageId: { type: String, unique: true },
  text: String,
  type: String,
  userId: String
});

export const loadMessageClass = () => {
  class Message {}
  messageSchema.loadClass(Message);
  return messageSchema;
};

export const Messages = model<any, any>('viber_messages', loadMessageClass());

export const integrationSchema = new Schema({
  inboxId: String,
  accountId: String,
  token: String
});

export const loadIntegrationClass = () => {
  class Integration {}
  integrationSchema.loadClass(Integration);
  return integrationSchema;
};

export const Integrations = model<any, any>(
  'viber_integrations',
  loadIntegrationClass()
);

export const accountSchema = new Schema({
  name: String
});

export const loadAccountClass = () => {
  class Account {
    static async removeAccount(_id) {
      return Accounts.deleteOne({ _id });
    }

    static async getAccounts() {
      return Accounts.find({});
    }
  }

  accountSchema.loadClass(Account);

  return accountSchema;
};

export const Accounts = model<any, any>('viber_accounts', loadAccountClass());

// ---------------------------------------------------------------------------

// export interface IConversation {
//   erxesApiId?: string;
//   timestamp: Date;
//   senderId: string;
//   recipientId: string;
//   integrationId: string;
//   messageText: string;
//   messageType: string;
// }

// export interface IConversationDocument extends IConversation, Document {}

// export interface IConversationModel extends Model<IConversationDocument> {
//   getConversation(selector): Promise<IConversationDocument>;
// }

// export const conversationSchema = new Schema({
//   erxesApiId: String,
//   timestamp: Date,
//   senderId: { type: String, index: true },
//   recipientId: { type: String, index: true },
//   integrationId: String,
//   messageText: String,
//   messageType: String
// });

// conversationSchema.index({ senderId: 1, recipientId: 1 }, { unique: true });

// export const loadConversationClass = () => {
//   class Conversation {
//     static async getConversation(selector: {}) {
//       const conversation = await Conversation.findOne(selector);

//       if (!conversation) {
//         throw new Error('Conversation not found');
//       }

//       return conversation;
//     }
//   }

//   conversationSchema.loadClass(Conversation);

//   return conversationSchema;
// };

// export const Conversation = model<any, any>('viber_conversation', loadConversationClass());

// ---------------------------------------------------------------------------

export interface IConversation extends Document {
  erxesApiId?: string;
  timestamp: Date;
  senderId: string;
  recipientId?: string;
  integrationId: string;
}

export const conversationSchema = new Schema<IConversation>({
  erxesApiId: String,
  timestamp: Date,
  senderId: { type: String, index: true },
  recipientId: { type: String, index: true, required: false },
  integrationId: String
});

conversationSchema.index({ senderId: 1, recipientId: 1 }, { unique: true });

export const Conversations = model<IConversation>(
  'viber_conversation',
  conversationSchema
);

// ---------------------------------------------------------------------------

export interface IConversationMessages extends Document {
  conversationId: string;
  userId: string;
  customerId: string;
  timestamp: Date;
  messageText: string;
  messageType: string;
}

export const conversationMessageSchema = new Schema<IConversationMessages>({
  conversationId: String,
  userId: String,
  customerId: String,
  timestamp: Date,
  messageText: String,
  messageType: String
});

export const ConversationMessages = model<IConversationMessages>(
  'viber_conversation_messages',
  conversationMessageSchema
);
