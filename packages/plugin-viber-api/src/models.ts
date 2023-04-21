import { Schema, model } from 'mongoose';

export const customerSchema = new Schema({
  inboxIntegrationId: String,
  contactsId: String,
  email: { type: String, unique: true },
  firstName: String,
  lastName: String
});

export const loadCustomerClass = () => {
  class Customer {}
  customerSchema.loadClass(Customer);
  return customerSchema;
};

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
  subject: String,
  messageId: { type: String, unique: true },
  inReplyTo: String,
  references: [String],
  body: String,
  to: [emailSchema],
  cc: [emailSchema],
  bcc: [emailSchema],
  from: [emailSchema],
  createdAt: { type: Date, index: true, default: new Date() }
});

export const loadMessageClass = () => {
  class Message {}
  messageSchema.loadClass(Message);
  return messageSchema;
};

// schema for integration document
export const integrationSchema = new Schema({
  inboxId: String,
  accountId: String
});

export const loadIntegrationClass = () => {
  class Integration {}
  integrationSchema.loadClass(Integration);
  return integrationSchema;
};

// schema for integration account
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

export const Customers = model<any, any>(
  'viber_customers',
  loadCustomerClass()
);

export const Integrations = model<any, any>(
  'viber_integrations',
  loadIntegrationClass()
);

export const Messages = model<any, any>('viber_messages', loadMessageClass());

export const Accounts = model<any, any>('viber_accounts', loadAccountClass());

export const integration1Schema = new Schema({
  inboxId: String,
  accountId: String
});

export interface IViberMessage {
  senderId: string;
  senderName: string;
  sendDate: Date;
  messageText: string;
  messageType: string;
}

export const ViberMessageSchema: Schema = new Schema<IViberMessage>({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  sendDate: { type: Date, required: true },
  messageText: { type: String, required: true },
  messageType: { type: String, required: true }
});

export const ViberMessage = model('viber_received_message', ViberMessageSchema);

export interface IViberSentMessage {
  senderId: string;
  receiverId: string;
  sendDate: Date;
  messageText: string;
}

export const ViberSentMessageSchema: Schema = new Schema<IViberSentMessage>({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  sendDate: { type: Date, required: true },
  messageText: { type: String, required: true }
});

export const ViberSentMessage = model(
  'viber_sent_message',
  ViberSentMessageSchema
);
