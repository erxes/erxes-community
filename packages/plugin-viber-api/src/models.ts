import { Schema, model, Document, Model } from 'mongoose';
import { sendInboxMessage } from './messageBroker';

interface ICustomer {
  inboxIntegrationId: string;
  contactsId: string;
  viberId: string;
  name: string;
  country: string;
}

export const customerSchema = new Schema<ICustomer>({
  inboxIntegrationId: String,
  contactsId: String,
  viberId: String,
  name: String,
  country: String
});

export const loadCustomerClass = () => {
  class Customer {
    static async getOrCreate(viberAccount: ICustomer, subdomain: string) {
      let customer = await Customers.findOne({ viberId: viberAccount.viberId });

      if (!customer) {
        customer = await Customers.create({
          inboxIntegrationId: viberAccount.inboxIntegrationId,
          contactsId: null,
          viberId: viberAccount.viberId,
          name: viberAccount.name,
          country: viberAccount.country
        });

        try {
          const apiCustomerResponse = await sendInboxMessage({
            subdomain,
            action: 'integrations.receive',
            data: {
              action: 'get-create-update-customer',
              payload: JSON.stringify({
                integrationId: viberAccount.inboxIntegrationId,
                firstName: viberAccount.name,
                lastName: null,
                avatar: null,
                isUser: true
              })
            },
            isRPC: true
          });

          customer.contactsId = apiCustomerResponse._id;
          await customer.save();
        } catch (e) {
          await customer.deleteOne({ _id: customer._id });
          throw new Error(e);
        }
      }

      return customer;
    }
  }
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
