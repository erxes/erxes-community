import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { initBroker } from './messageBroker';
import init from './controller';
import { webhookListener } from './viber/api';

export let mainDb;
export let graphqlPubsub;
export let serviceDiscovery;
export let debug;

export default {
  name: 'viber',
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
        kind: 'viber',
        label: 'Viber'
      }
    ]
  },

  postHandlers: [{ path: '/webhook/:integrationId', method: webhookListener }],

  apolloServerContext: async context => {
    return context;
  },

  onServerInit: async options => {
    const app = options.app;
    mainDb = options.db;

    debug = options.debug;
    graphqlPubsub = options.pubsubClient;

    initBroker(options.messageBrokerClient);

    init(app);
  }
};
