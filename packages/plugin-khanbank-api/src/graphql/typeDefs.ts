import { gql } from 'apollo-server-express';

import {
  mutations as configMutations,
  queries as configQueries,
  types as configTypes
} from './schema/configs';

const typeDefs = async () => {
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
    
    ${configTypes}

    
    extend type Query {
      ${configQueries}

    }
    
    extend type Mutation {
      ${configMutations}

    }
  `;
};

export default typeDefs;
