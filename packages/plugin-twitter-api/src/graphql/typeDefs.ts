import { gql } from 'apollo-server-express';

const queries = `
  twitterWebhook: String
  twitterWebhookGet: String
  twitterGetAccount(accountId: String): String
  twitterAccounts: JSON
`;

const mutations = `
  twitterWebhookPost(data: JSON): JSON
  twitterCreateIntegration(accountId: String, integrationId: String, data: JSON, kind: String): String
  twitterReply(attachments: String, conversationId: String, content: String, integrationId: String): String
`;

const typeDefs = gql`
  scalar JSON
  scalar Date

  extend type Query {
    ${queries}
  }

  extend type Mutation {
    ${mutations}
  }
`;

export default typeDefs;
