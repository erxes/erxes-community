import * as dotenv from 'dotenv';
import {
  ISendMessageArgs,
  sendMessage as sendCommonMessage
} from '@erxes/api-utils/src/core';
import { serviceDiscovery } from './configs';
import { Customers, Integrations, Messages } from './models';
import { setWebhook } from './viber';
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
