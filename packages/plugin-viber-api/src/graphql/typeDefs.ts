import { gql } from 'apollo-server-express';

const types = `
  input CreateInput {
    _id: String
    createdUserId: String
    createdDate: Date
    name: String
    key: String
  }

  type SentMessage {
    _id: String
    userId: String
    senderId: String
    sendDate: Date
    messageText: String
  }

  type ViberMessageDetail {
    _id: String
    userId: String
    customerId: String
    content: String
    createdAt: Date
    mailData: JSON
  }
`;

const queries = `
  viberReadSentMessage: [SentMessage]
  viberConversationDetail(conversationId: String!): [ViberMessageDetail]
`;

const mutations = `
  viberCreate(create: CreateInput): JSON
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
