import { ISendMessageArgs, sendMessage } from '@erxes/api-utils/src/core';
import { serviceDiscovery } from './configs';
import { Osms } from './models';

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeQueue, consumeRPCQueue } = client;

  consumeQueue('osm:send', async ({ data }) => {
    Osms.send(data);

    return {
      status: 'success'
    };
  });

  consumeRPCQueue('osm:find', async ({ data }) => {
    return {
      status: 'success',
      data: await Osms.find({})
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
