import { gql } from 'apollo-server-express';

const types = `
  type Telegram {
    _id: String!
    title: String
    mailData: JSON
  }
`;

const queries = `
  telegramConversationDetail(conversationId: String!): [Telegram]
  telegramAccounts: JSON
`;

const mutations = `
  telegramAccountRemove(_id: String!): String
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
