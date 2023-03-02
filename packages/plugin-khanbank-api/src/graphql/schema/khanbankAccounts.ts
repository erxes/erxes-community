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
    openDate: String
    homeBranch: String
    intMethod: String
    intRate: String
    customerName: String
    homePhone: String
    businessPhone: String

    lastMaintenceDate: String
    lastFinancialTranDate: String

    intFrom: String
    intTo: String
    addr1: String
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
  khanbankAccountBalance(configId: String!, accountNumber: String!): KhanbankAccount
  khanbankAccountDetail(configId: String!, accountNumber: String!): KhanbankAccount
`;
