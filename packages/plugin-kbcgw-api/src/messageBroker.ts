import { ISendMessageArgs, sendMessage } from '@erxes/api-utils/src/core';
import { serviceDiscovery } from './configs';
import { Kbcgws } from './models';

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeQueue, consumeRPCQueue } = client;

  consumeQueue('kbcgw:send', async ({ data }) => {
    Kbcgws.send(data);

    return {
      status: 'success'
    };
  });

  consumeRPCQueue('kbcgw:find', async ({ data }) => {
    return {
      status: 'success',
      data: await Kbcgws.find({})
    };
  });
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
