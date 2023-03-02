export const types = `

  type KhanbankAccount {
    number: String
    type: String
    currency: String
    status: String
    balance: Float
    name: String
    holdBalance: Float
    availableBalance: Float
  }
`;

const mutationParams = `

`;

export const mutations = `

`;

const qryParams = `
    page: Int
    perPage: Int
`;

export const queries = `
  khanbankAccounts(configId: String!): [KhanbankAccount]
`;
