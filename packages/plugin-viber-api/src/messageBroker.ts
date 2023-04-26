import * as dotenv from 'dotenv';
import {
  ISendMessageArgs,
  sendMessage as sendCommonMessage
} from '@erxes/api-utils/src/core';
import { serviceDiscovery } from './configs';
import { Customers, Integrations, Messages } from './models';
import { ViberAPI } from './viber/api';

dotenv.config();

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeRPCQueue } = client;

  consumeRPCQueue('viber:createIntegration', async (args: ISendMessageArgs) => {
    const { subdomain, data } = args;
    const { integrationId, doc } = data;
    const docData = JSON.parse(doc.data);
    await Integrations.create({
      inboxId: integrationId,
      ...docData
    });

    const api = new ViberAPI({
      token: docData.token,
      integrationId,
      subdomain
    });

    try {
      await api.registerWebhook();
    } catch (e) {
      return {
        status: 'failed',
        data: e.message
      };
    }

    return {
      status: 'success'
    };
  });

  consumeRPCQueue(
    'viber:removeIntegrations',
    async (args: ISendMessageArgs) => {
      const { subdomain, data } = args;
      const { integrationId } = data;

      await Messages.remove({ inboxIntegrationId: integrationId });
      await Customers.remove({ inboxIntegrationId: integrationId });
      await Integrations.remove({ inboxId: integrationId });

      return {
        status: 'success'
      };
    }
  );

  consumeRPCQueue(
    'viber:api_to_integrations',
    async (args: ISendMessageArgs) => {
      const { subdomain, data } = args;
      const payload = JSON.parse(data.payload);
      const integrationId = payload.integrationId;

      const integration = await Integrations.findOne({
        inboxId: integrationId
      });

      if (data.action.includes('reply')) {
        const api = new ViberAPI({
          token: integration.token,
          integrationId,
          subdomain
        });

        await api.sendMessage(payload);
      }

      return {
        status: 'success'
      };
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
