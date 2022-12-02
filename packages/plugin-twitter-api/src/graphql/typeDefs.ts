import { gql } from 'apollo-server-express';

const types = `
  type ITwitter {
    _id: String!
    title: String
    data: JSON
  }
`;

const queries = `
  twitterConversationDetail(conversationId: String!): [ITwitter]
`;

const mutations = `
  twitterReply(attachments: String, conversationId: String, content: String, integrationId: String): String
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
