import { Model } from 'mongoose';
import {
  ICustomerDocument,
  IConversationDocument,
  IConversationMessageDocument,
  IIntegrationDocument,
  IConfigDocument,
  conversationMessageSchema,
  customerSchema,
  integrationSchema,
  configSchema,
  IAccountDocument,
  accountSchema,
  IMessageDocument,
  messageSchema,
  ITweetDocument,
  tweetSchema
} from './definitions/twitter';
import { IModels } from '../connectionResolver';

export interface ICustomerModel extends Model<ICustomerDocument> {}

export const loadCustomerClass = () => {
  class Customer {}

  customerSchema.loadClass(Customer);

  return customerSchema;
};

export interface IConversationMessageModel
  extends Model<IConversationMessageDocument> {}

export const loadConversationMessageClass = models => {
  class ConversationMessage {}

  conversationMessageSchema.loadClass(ConversationMessage);

  return conversationMessageSchema;
};

export interface IIntegrationModel extends Model<IIntegrationDocument> {
  getIntegration(accountId): Promise<IIntegrationDocument>;
}

export const loadIntegrationClass = (models: IModels) => {
  class Integration {
    public static async getIntegration(accountId) {
      const integration = await models.Integrations.findOne(accountId);

      if (!integration) {
        throw new Error('Integration not found');
      }

      return integration;
    }
  }

  integrationSchema.loadClass(Integration);

  return integrationSchema;
};

export interface IMessageModel extends Model<IMessageDocument> {}

export const loadMessageClass = models => {
  class Message {}

  messageSchema.loadClass(Message);

  return messageSchema;
};

export interface ITweetModel extends Model<ITweetDocument> {}

export const loadTweetClass = models => {
  class Tweet {}

  tweetSchema.loadClass(Tweet);

  return tweetSchema;
};

export interface IConfig {
  code: string;
  value: any;
}
export interface IConfigModel extends Model<IConfigDocument> {
  getConfig(code: string): Promise<IConfigDocument>;
  updateConfigs(configsMap): Promise<void>;
  createOrUpdateConfig({ code, value }: IConfig): IConfigDocument;
}

export const loadConfigClass = models => {
  class Config {
    /*
     * Get a Config
     */
    public static async getConfig(code: string) {
      const config = await models.Configs.findOne({ code });

      if (!config) {
        return { value: '' };
      }

      return config;
    }

    /**
     * Create or update config
     */
    public static async createOrUpdateConfig({
      code,
      value
    }: {
      code: string;
      value: string[];
    }) {
      const obj = await models.Configs.findOne({ code });

      if (obj) {
        await models.Configs.updateOne({ _id: obj._id }, { $set: { value } });

        return models.Configs.findOne({ _id: obj._id });
      }

      return models.Configs.create({ code, value });
    }

    /**
     * Update configs
     */
    public static async updateConfigs(configsMap) {
      const codes = Object.keys(configsMap);

      for (const code of codes) {
        if (!code) {
          continue;
        }

        const value = configsMap[code];
        const doc = { code, value };

        await models.Configs.createOrUpdateConfig(doc);
      }
    }
  }

  configSchema.loadClass(Config);

  return configSchema;
};

export interface IAccountModel extends Model<IAccountDocument> {
  getAccount(selector): Promise<IAccountDocument>;
}
export const loadAccountClass = models => {
  class Account {
    public static async getAccount(selector) {
      const account = await models.Accounts.findOne(selector);

      if (!account) {
        throw new Error('Account not found');
      }

      return account;
    }
  }

  accountSchema.loadClass(Account);

  return accountSchema;
};
