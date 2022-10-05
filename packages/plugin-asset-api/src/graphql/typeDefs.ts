import { gql } from 'apollo-server-express';

import {
  types as assetTypes,
  queries as assetQueries,
  mutations as assetMutations
} from './schema/asset';
import {
  types as movementTypes,
  queries as movementQueries,
  mutations as movementMutations
} from './schema/movement';

const typeDefs = async serviceDiscovery => {
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

    ${assetTypes(contactsAvailable)}
    ${movementTypes}
    
    extend type Query {
      ${assetQueries}
      ${movementQueries}
    }
    
    extend type Mutation {
      ${assetMutations}
      ${movementMutations}
    }
  `;
};

export default typeDefs;
