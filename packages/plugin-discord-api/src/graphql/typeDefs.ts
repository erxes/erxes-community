import { gql } from 'apollo-server-express';

const types = `
  type Discord {
    _id: String!
    title: String
    messageData: JSON
  }
`;

const queries = `
  discordConversationDetail(conversationId: String!): [Discord]
  discordAccounts: JSON
  discordChannels(accountId: String!): JSON
`;

const mutations = `
  discordAccountRemove(_id: String!): String
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
