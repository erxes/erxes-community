import { gql } from 'apollo-server-express';

import { types as assetTypes, queries as assetQueries, mutations as assetMutations } from './schema/asset';

const typeDefs = async serviceDiscovery => {
  const tagsAvailable = await serviceDiscovery.isEnabled('tags');
  const contactsAvailable = await serviceDiscovery.isEnabled('contacts');

  return gql`
    scalar JSON
    scalar Date

    enum CacheControlScope {
      PUBLIC
      PRIVATE
    }

    directive @cacheControl(
      maxAge: Int
      scope: CacheControlScope
      inheritMaxAge: Boolean
    ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

    ${assetTypes(tagsAvailable, contactsAvailable)}
    
    extend type Query {
      ${assetQueries}
    }
    
    extend type Mutation {
      ${assetMutations}
    }
  `;
};

export default typeDefs;
