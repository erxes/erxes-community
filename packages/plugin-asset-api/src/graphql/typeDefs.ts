import { gql } from 'apollo-server-express';

import { types as assetGroupTypes, queries as assetGroupQueries, mutations as assetGroupmMtations } from './schema/assetGroup';

const typeDefs = async _serviceDiscovery => {
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

    ${assetGroupTypes}
    
    extend type Query {
      ${assetGroupQueries}
    }
    
    extend type Mutation {
      ${assetGroupmMtations}
    }
  `;
};

export default typeDefs;
