export const types = `
  type Payment {
    _id: String!
    name: String!
    kind: String!
    status: String
    config: JSON
    createdAt: Date
  }

  type paymentsTotalCount {
    byKind: JSON
    byStatus: JSON
    total: Int
  }
`;

const paymentOptionsParams = `
  paymentIds: [String]
  amount: Float
  contentType: String
  contentTypeId: String
  customerId: String
  companyId: String
  description: String
  redirectUri: String
  phone: String
`;

export const queries = `
  payments(status: String): [Payment]
  paymentsCountByType: paymentsTotalCount
  paymentsTotalCount(kind: String, status: String): paymentsTotalCount
  
  getPaymentOptions(${paymentOptionsParams} ): String
`;

const params = `
  name: String!
  kind: String!
  status: String
  config: JSON
`;

export const mutations = `
  paymentAdd(${params}): Payment
  paymentEdit(id: String!,${params}): Payment
  paymentRemove(id: String!): String
`;
