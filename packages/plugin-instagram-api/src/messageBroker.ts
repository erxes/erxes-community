import * as dotenv from 'dotenv';
import {
  ISendMessageArgs,
  sendMessage as sendCommonMessage
} from '@erxes/api-utils/src/core';
import { serviceDiscovery } from './configs';
import { Customers, Integrations } from './models';
import { instagramAPI } from './instagram/api';

dotenv.config();

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeRPCQueue } = client;

  consumeRPCQueue(
    'instagram:createIntegration',
    async (args: ISendMessageArgs): Promise<any> => {
      const { subdomain, data } = args;
      const { integrationId, doc } = data;
      const docData = JSON.parse(doc.data);

      const instagramIntegration = await Integrations.create({
        inboxId: integrationId,
        ...docData
      });

      const instagramApi: instagramAPI = new instagramAPI({
        token: docData.token,
        integrationId,
        subdomain
      });

      // registering webhook
      try {
        await instagramApi.registerWebhook();
      } catch (e) {
        await Integrations.deleteOne({ _id: instagramIntegration._id });
        return {
          status: 'failed',
          data: e.message
        };
      }

      return {
        status: 'success'
      };
    }
  );

  consumeRPCQueue(
    'instagram:removeIntegrations',
    async (args: ISendMessageArgs): Promise<any> => {
      const { data } = args;
      const { integrationId } = data;

      await Customers.remove({ inboxIntegrationId: integrationId });
      await Integrations.remove({ inboxId: integrationId });

      return {
        status: 'success'
      };
    }
  );

  consumeRPCQueue(
    'instagram:api_to_integrations',
    async (args: ISendMessageArgs): Promise<any> => {
      const { subdomain, data } = args;
      const payload = JSON.parse(data.payload);
      const integrationId = payload.integrationId;

      const instagramIntegration = await Integrations.findOne(
        { inboxId: integrationId },
        { inboxId: 1, token: 1 }
      );

      if (!instagramIntegration) {
        return {
          status: 'failed',
          data: 'instagram integration not found.'
        };
      }

      if (data.action.includes('reply')) {
        const instagramApi: instagramAPI = new instagramAPI({
          token: instagramIntegration.token,
          integrationId,
          subdomain
        });
        await instagramApi.sendMessage(payload);
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
