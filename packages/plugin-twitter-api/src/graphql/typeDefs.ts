import { gql } from 'apollo-server-express';

const queries = `
  twitterLogin: String
  twitterCallbackAdd(oauth_token: String, oauth_verifier: String,   oauth_token_secret: String, redirect: String ): String
  twitterWebhook: String
  twitterWebhookGet: String
  twitterGetAccount(accountId: String): String
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
