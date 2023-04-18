import { gql } from 'apollo-server-express';

const types = `
  type Viber {
    _id: String!
    title: String
    mailData: JSON
  }
`;

const queries = `
  viberConversationDetail(conversationId: String!): [Viber]
  viberAccounts: JSON
`;

const mutations = `
  viberAccountRemove(_id: String!): String
`;

const typeDefs = gql`
  scalar JSON
  scalar Date

  ${types}

  extend type Query {
    ${queries}
  }

  extend type Mutation {
    ${mutations}
  }
`;

export default typeDefs;
