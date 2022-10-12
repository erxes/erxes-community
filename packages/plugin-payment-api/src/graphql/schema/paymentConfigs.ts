export const types = `
  type PaymentConfig {
    _id: String!
    contentType: String!
    contentTypeId: String!
    paymentIds: [String]
  }
`;

export const queries = `
    getPaymentConfig(contentType: String!, contentTypeId: String!): PaymentConfig
`;

const mutationParams = `
    contentType: String!
    contentTypeId: String!
`;

export const mutations = `
    setPaymentConfig(${mutationParams}): PaymentConfig
    removePaymentConfig(${mutationParams}): String
`;
