import { gql } from 'apollo-server-express';

import {
  mutations as rcfaMutations,
  queries as rcfaQueries,
  types as rcfaTypes
} from './schema/rcfa';
import {
  mutations as rcfaQuestionMutations,
  queries as rcfaQuestionQueries,
  types as rcfaQuestionTypes
} from './schema/question';
import {
  mutations as rcfaRelatedTaskMutations,
  queries as rcfaRelatedTaskQueries,
  types as rcfaRelatedTaskTypes
} from './schema/relatedTask';

const typeDefs = async (serviceDiscovery: any) => {
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
    ${rcfaQuestionTypes}
    ${rcfaRelatedTaskTypes}

    extend type Query {
      ${rcfaQueries}
      ${rcfaQuestionQueries}
      ${rcfaRelatedTaskQueries}
    }
    
    extend type Mutation {
      ${rcfaMutations}
      ${rcfaQuestionMutations}
      ${rcfaRelatedTaskMutations}
    }
  `;
};

export default typeDefs;
