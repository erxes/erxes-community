import { ISendMessageArgs, sendMessage } from '@erxes/api-utils/src/core';
import { serviceDiscovery } from './configs';
import { generateModels } from './connectionResolver';

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeRPCQueue } = client;

  consumeRPCQueue('rcfa:rcfa.find', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.RCFAQuestions.find(data).lean()
    };
  });

  // plugin-cards-api/src/messagebrokers/   - createRelatedItem
  consumeRPCQueue('cards:createRelatedItem', async ({ subdomain, data }) => {
    const { type, sourceType, itemId, name, stageId } = data;

    await sendCoreMessage({
      subdomain,
      action: 'conformities.addConformity',
      data: {
        mainType: sourceType,
        mainTypeId: itemId,
        relType: type,
        relTypeId: 'relatedCard._id'
      }
    });

    return {
      status: 'success'
    };
  });
};

export const sendContactsMessage = (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'contacts',
    ...args
  });
};

export const sendFormsMessage = (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'forms',
    ...args
  });
};

export const sendCardsMessage = (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'cards',
    ...args
  });
};

export const sendCoreMessage = (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'core',
    ...args
  });
};

export const sendKbMessage = (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'knowledgebase',
    ...args
  });
};

export default function() {
  return client;
}
