import { gql } from 'apollo-server-express';

import { types, queries, mutations } from './schema/asset';

import {
  types as assetsConfigTypes,
  queries as assetsConfigQueries,
  mutations as assetsConfigMutations
} from './schema/config';

import { types as uomTypes, queries as uomQueries, mutations as uomMutations } from './schema/uom';

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
    
    ${types(tagsAvailable, contactsAvailable)}
    ${assetsConfigTypes}
    ${uomTypes}
    
    extend type Query {
      ${queries}
      ${assetsConfigQueries}
      ${uomQueries}
    }
    
    extend type Mutation {
      ${mutations}
      ${assetsConfigMutations}
      ${uomMutations}
    }
  `;
};

export default typeDefs;
