import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

import { initBroker } from './messageBroker';
import { generateModels } from './connectionResolver';
import { getSubdomain } from '@erxes/api-utils/src/core';

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
    inboxIntegration: {
      kind: 'twitter',
      label: 'Twitter'
    }
  },
  apolloServerContext: async (context, req) => {
    const subdomain = getSubdomain(req);

    context.subdomain = subdomain;
    context.models = await generateModels(subdomain);
  },

  onServerInit: async options => {
    mainDb = options.db;
    const app = options.app;

    debug = options.debug;
    graphqlPubsub = options.pubsubClient;

    initBroker(options.messageBrokerClient);

    app.get('/twitter/login', async (_req, res) => {
      // const { twitterAuthUrl } = await twitterUtils.getTwitterAuthUrl();

      return res.redirect('twitter');
    });
    app.get('/connect-twitter', async (req: any, res, _next) => {
      console.log('HAHAHA');

      if (!req.user) {
        return res.end('forbidden');
      }

      const { link, kind, type } = req.query;

      let url = `${process.env.REACT_APP_DOMAIN_URL}/${link}?kind=${kind}&userId=${req.user._id}`;

      if (type) {
        url = `${url}&type=${type}`;
      }

      return res.redirect(url);
    });
  }
};
