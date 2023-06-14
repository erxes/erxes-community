import { gql } from 'apollo-server-express';
import { attachmentType } from '@erxes/api-utils/src/commonTypeDefs';

const types = `
  ${attachmentType}

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

  extend type Customer @key(fields: "_id") {
    _id: String! @external
  }

  extend type User @key(fields: "_id") {
    _id: String! @external
  }

  type ViberMessageResponse {
    _id: String!
    content: String
    conversationId: String
    attachments: [Attachment]
    fromBot: Boolean
    botData: JSON
    customerId: String
    userId: String
    createdAt: Date
    isCustomerRead: Boolean
    mid: String
    internal: Boolean
    customer: Customer
    user: User
  }
`;

const queries = `
  viberReadSentMessage: [SentMessage]
  viberConversationDetail(conversationId: String!): [ViberMessageDetail]
  viberConversationMessages(conversationId: String! getFirst: Boolean, skip: Int, limit: Int): [ViberMessageResponse]
  viberConversationMessagesCount(conversationId: String!): Int
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
