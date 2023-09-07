import { ISendMessageArgs, sendMessage } from '@erxes/api-utils/src/core';
import { serviceDiscovery } from './configs';
import { generateToken } from './utils';
import { generateModels } from './connectionResolver';

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeQueue, consumeRPCQueue } = client;

  // consumeQueue('calls:send', async ({ subdomain, data }) => {
  //   const models = await generateModels(subdomain);
  //   models.Calls.send(data);

  //   return {
  //     status: 'success',
  //   };
  // });

  consumeRPCQueue('calls:find', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);
    return {
      status: 'success',
      data: await models.Calls.find({})
    };
  });

  consumeRPCQueue(
    'calls:createIntegration',
    async (args: ISendMessageArgs): Promise<any> => {
      const { subdomain, data } = args;
      const { integrationId, doc } = data;
      const models = generateModels(subdomain);
      const docData = JSON.parse(doc.data);
      console.log('docData:', docData);
      // const { username, password, ...rest } = docData;

      const token = await generateToken(integrationId);

      await (await models).Integrations.create({
        inboxId: integrationId,
        token,
        ...docData
      });

      return {
        status: 'success'
      };
    }
  );

  consumeRPCQueue(
    'calls:api_to_integrations',
    async (args: ISendMessageArgs): Promise<any> => {
      const { subdomain, data } = args;
      const { inboxId, action } = data;
      const models = await generateModels(subdomain);
      const integration = await models.Integrations.findOne({ inboxId });

      if (!integration) {
        return {
          status: 'failed',
          data: 'integration not found.'
        };
      }

      switch (action) {
        case 'getConfigs':
          return {
            status: 'success',
            data: integration
          };
        case 'getDetails':
          return {
            status: 'success',
            data: integration
          };
        default:
          return {
            status: 'failed',
            data: 'action not found.'
          };
      }
    }
  );
};

export const sendCommonMessage = async (
  args: ISendMessageArgs & { serviceName: string }
) => {
  return sendMessage({
    serviceDiscovery,
    client,
    ...args
  });
};

export default function() {
  return client;
}
