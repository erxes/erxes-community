import { gql } from 'apollo-server-express';

import {
  mutations as rcfaMutations,
  queries as rcfaQueries,
  types as rcfaTypes
} from './schema/rcfa';

const typeDefs = async serviceDiscovery => {
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

    ${rcfaTypes}
    
    extend type Query {
      ${rcfaQueries}
    }
    
    extend type Mutation {
      ${rcfaMutations}
    }
  `;
};

export default typeDefs;
