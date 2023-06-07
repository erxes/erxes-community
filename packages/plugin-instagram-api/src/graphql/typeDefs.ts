import { gql } from 'apollo-server-express';

const types = `
  input createInput {
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
`;

const queries = `
  instagramReadSentMessage: [SentMessage]
`;

const mutations = `
  instagramCreate(create: createInput): JSON
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
