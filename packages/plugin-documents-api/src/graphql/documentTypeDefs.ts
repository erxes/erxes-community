export const types = `
  type Document {
    _id: String!

    createdAt: Date
    createdUserId: String

    contentType: String!
    name: String!
    content: String
  }
`;

const params = `
  limit: Int,
  page: Int,
  perPage: Int,
`;

export const queries = `
  documents(${params}): [Document]
  documentCounts: Int
`;

export const mutations = `
  documentsSave(_id: String, contentType: String!, name: String!, content: String): Document
  documentsRemove(_id: String!): JSON
`;
