import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

import { generateModels } from './connectionResolver';
import { getSubdomain } from '@erxes/api-utils/src/core';
import { initBroker, sendCommonMessage } from './messageBroker';
import { routeErrorHandling } from '@erxes/api-utils/src/requests';

export let mainDb;
export let graphqlPubsub;
export let serviceDiscovery;

export let debug;

export default {
  name: 'documents',
  graphql: sd => {
    serviceDiscovery = sd;
    return {
      typeDefs,
      resolvers
    };
  },
  hasSubscriptions: true,
  segment: {},
  apolloServerContext: async (context, req) => {
    const subdomain = getSubdomain(req);

    context.subdomain = subdomain;
    context.models = await generateModels(subdomain);
  },

  onServerInit: async options => {
    mainDb = options.db;

    const app = options.app;

    app.get(
      '/print',
      routeErrorHandling(
        async (req, res) => {
          const { contentType, stageId, itemId } = req.query;
          const subdomain = getSubdomain(req);
          const models = await generateModels(subdomain);
          const document = await models.Documents.findOne({ contentType });

          if (!document) {
            return res.send('Not found');
          }

          const replacedContent = await sendCommonMessage({
            subdomain,
            serviceName: contentType,
            action: 'documents.replaceContent',
            isRPC: true,
            data: {
              stageId,
              itemId,
              content: document.content
            }
          });

          return res.send(replacedContent);
        },
        res => res.send('Not found')
      )
    );

    initBroker(options.messageBrokerClient);

    debug = options.debug;
    graphqlPubsub = options.pubsubClient;
  }
};
