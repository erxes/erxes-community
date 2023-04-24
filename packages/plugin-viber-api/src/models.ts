import { Schema, model } from 'mongoose';

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
