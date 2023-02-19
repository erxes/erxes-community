import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

import { initBroker } from './messageBroker';
import { generateModels } from './connectionResolver';
import { getSubdomain } from '@erxes/api-utils/src/core';
import initApp from './index';
import { initMemoryStorage } from './inmemoryStorage';

export let mainDb;
export let graphqlPubsub;
export let serviceDiscovery;

export let debug;

export default {
  name: 'twitter',
  graphql: sd => {
    serviceDiscovery = sd;
    return {
      typeDefs,
      resolvers
    };
  },
  meta: {
    inboxIntegrations: [
      {
        kind: 'twitter',
        label: 'Twitter'
      }
    ]
  },
  apolloServerContext: async (context, req) => {
    const subdomain = getSubdomain(req);

    context.subdomain = subdomain;
    context.models = await generateModels(subdomain);
  },

  onServerInit: async options => {
    mainDb = options.db;

    const app = options.app;

    initMemoryStorage();

    initBroker(options.messageBrokerClient);

    initApp(app);

    graphqlPubsub = options.pubsubClient;

    debug = options.debug;
  }
};
