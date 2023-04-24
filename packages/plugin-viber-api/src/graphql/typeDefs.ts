import { gql } from 'apollo-server-express';

const types = `
  input createInput {
    _id: String
    createdUserId: String
    createdDate: Date
    name: String
    key: String
  }

  input MessageInput {
    userId: String
    senderId: String
    receiverId: String
    sendDate: Date
    messageText: String
  }

  type SentMessage {
    _id: String
    userId: String
    senderId: String
    sendDate: Date
    messageText: String
  }
`;

const queries = `
  viberReadSentMessage: [SentMessage]
`;

const mutations = `
  viberCreate(create: createInput):JSON
  viberSendMessage(message: MessageInput): JSON
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
