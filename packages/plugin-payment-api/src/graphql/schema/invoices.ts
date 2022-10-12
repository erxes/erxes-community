export const types = ({ contacts }) => `
${
  contacts
    ? `
      extend type Customer @key(fields: "_id") {
        _id: String! @external
      }

      extend type Company @key(fields: "_id") {
        _id: String! @external
      }
      `
    : ''
}

  type invoicesTotalCount {
    total: Int
    byKind: JSON
    byStatus: JSON
  }

  type Invoice @key(fields: "_id") {
    _id: String
    paymentId: String
    amount: Float
    phone: String
    email: String
    description: String
    status: String
    companyId: String
    customerId: String
    contentType: String
    contentTypeId: String
    createdAt: Date
    resolvedAt: Date
    payment: Payment
    paymentKind: String
    apiResponse: JSON

    ${
      contacts
        ? `
        customer: Customer
        company: Company
        `
        : ''
    }

    pluginData: JSON
  }
`;

export const queries = `
  checkInvoice(_id:String!, paymentId: String!): Invoice
  invoices(searchValue: String, kind: String, status: String, page: Int, perPage: Int): [Invoice]
  invoicesTotalCount(searchValue: String, kind: String, status: String): invoicesTotalCount
`;
