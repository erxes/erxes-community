import { Schema, model, Document, Model } from 'mongoose';
import { sendInboxMessage } from './messageBroker';

interface ICustomer {
  inboxIntegrationId: string;
  contactsId: string;
  instagramId: string;
  name: string;
  country: string;
}

export const customerSchema: Schema<ICustomer> = new Schema<ICustomer>({
  inboxIntegrationId: String,
  contactsId: String,
  instagramId: String,
  name: String,
  country: String
});

export const loadCustomerClass = () => {
  class Customer {
    static async getOrCreate(
      instagramAccount: ICustomer,
      subdomain: string
    ): Promise<any> {
      let customer = await Customers.findOne({
        instagramId: instagramAccount.instagramId
      });

      if (!customer) {
        customer = await Customers.create({
          inboxIntegrationId: instagramAccount.inboxIntegrationId,
          contactsId: null,
          instagramId: instagramAccount.instagramId,
          name: instagramAccount.name,
          country: instagramAccount.country
        });

        try {
          const apiCustomerResponse = await sendInboxMessage({
            subdomain,
            action: 'integrations.receive',
            data: {
              action: 'get-create-update-customer',
              payload: JSON.stringify({
                integrationId: instagramAccount.inboxIntegrationId,
                firstName: instagramAccount.name,
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
  'instagram_customers',
  loadCustomerClass()
);

export const integrationSchema: Schema<any> = new Schema({
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
  'instagram_integrations',
  loadIntegrationClass()
);

export const accountSchema: Schema<any> = new Schema({
  name: String
});

export const loadAccountClass = () => {
  class Account {
    static async removeAccount(_id): Promise<any> {
      return Accounts.deleteOne({ _id });
    }

    static async getAccounts(): Promise<any> {
      return Accounts.find({});
    }
  }

  accountSchema.loadClass(Account);

  return accountSchema;
};

export const Accounts = model<any, any>(
  'instagram_accounts',
  loadAccountClass()
);

export interface IConversation extends Document {
  erxesApiId?: string;
  timestamp: Date;
  senderId: string;
  recipientId?: string;
  integrationId: string;
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

export const Conversations: Model<IConversation, {}> = model<IConversation>(
  'instagram_conversation',
  conversationSchema
);

export interface IConversationMessages extends Document {
  conversationId: string;
  userId: string;
  customerId: string;
  createdAt: Date;
  content: string;
  messageType: string;
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

export const ConversationMessages: Model<IConversationMessages, {}> = model<
  IConversationMessages
>('instagram_conversation_messages', conversationMessageSchema);
