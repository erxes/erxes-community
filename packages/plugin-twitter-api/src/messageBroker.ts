import * as dotenv from 'dotenv';
import {
  ISendMessageArgs,
  sendMessage as sendCommonMessage
} from '@erxes/api-utils/src/core';
import { serviceDiscovery } from './configs';
import { generateModels } from './connectionResolver';
import { handleTwitterMessage } from './handleTwitterMessage';

dotenv.config();

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeRPCQueue } = client;

  consumeRPCQueue(
    'twitter:createIntegration',
    async ({ subdomain, data: { doc, integrationId } }) => {
      const models = await generateModels(subdomain);

      const integration = await models.Integrations.create({
        inboxId: integrationId,
        ...(doc || {})
      });

      return {
        status: 'success'
      };
    }
  );

  consumeRPCQueue(
    'integrations:api_to_twitter_integrations',
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);

      const { action, type } = data;
      let response: any = null;

      try {
        if (action === 'reply') {
          response = { data: await handleTwitterMessage(models, data) };
        }
      } catch (e) {
        response = {
          status: 'error',
          errorMessage: e.message
        };
      }
    }
  );
};

export default function() {
  return client;
}

export const sendContactsMessage = (args: ISendMessageArgs) => {
  return sendCommonMessage({
    client,
    serviceDiscovery,
    serviceName: 'contacts',
    ...args
  });
};

export const sendInboxMessage = (args: ISendMessageArgs) => {
  return sendCommonMessage({
    client,
    serviceDiscovery,
    serviceName: 'inbox',
    ...args
  });
};
