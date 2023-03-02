import { gql } from 'apollo-server-express';

import {
  mutations as configMutations,
  queries as configQueries,
  types as configTypes
} from './schema/configs';

import {
  mutations as accountMutations,
  queries as accountQueries,
  types as accountTypes
} from './schema/khanbankAccounts';

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

    extend type User @key(fields: "_id") {
      _id: String! @external
    }

    extend type Department @key(fields: "_id") {
      _id: String! @external
    }
    
    ${configTypes}
    ${accountTypes}

    extend type Query {
      ${configQueries}
      ${accountQueries}
    }
    
    extend type Mutation {
      ${configMutations}
      ${accountMutations}
    }
  `;
};

export default typeDefs;
