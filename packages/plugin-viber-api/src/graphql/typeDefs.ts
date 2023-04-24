import { gql } from 'apollo-server-express';

const types = `
  input MessageInput {
    userId: String
    senderId: String
    receiverId: String
    sendDate: Date
    messageText: String
  }

  type ApiKey {
    _id: String
    userId: String
    key: String
    createdDate: Date
  }
  type ReceivedMessage {
    _id: String
    userId: String
    senderId: String
    senderName: String
    sendDate: Date
    messageText: String
    messageType: String
  }
  type SentMessage {
    _id: String
    userId: String
    senderId: String
    sendDate: Date
    messageText: String
  }
  type Viber {
    _id: String!
    title: String
    mailData: JSON
  }
`;

const queries = `
  viberAPIKey: ApiKey
  viberReceivedMessage(senderId: String!): [ReceivedMessage]
  viberSentMessage: [SentMessage]
  viberSetWebhook: JSON
  viberGetProfile: JSON
`;

const mutations = `
  viberSendMessage(message: MessageInput): JSON

  viberAccountRemove(_id: String!): String
  viberMessageRemove(_id: String!): String
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
