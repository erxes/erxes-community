import * as dotenv from 'dotenv';
import {
  ISendMessageArgs,
  sendMessage as sendCommonMessage
} from '@erxes/api-utils/src/core';
import { serviceDiscovery } from './configs';

dotenv.config();

let client;

export const initBroker = async cl => {
  client = cl;
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
export const sendRPCMessage = async (message): Promise<any> => {
  return client.sendRPCMessage('rpc_queue:integrations_to_api', message);
};
