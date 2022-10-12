const payments = `
query payments($status: String) {
  payments(status: $status) {
    _id
    name
    kind
    status
    config
  }
}
`;

const paymentsTotalCountQuery = `
query paymentsTotalCount($kind: String, $status: String) {
  paymentsTotalCount(kind: $kind, status: $status) {
    byKind
    total
  }
}
`;

const checkInvoice = `
query checkInvoice($paymentId: String!, $invoiceId: String!) {
  checkInvoice(paymentId: $paymentId, invoiceId: $invoiceId)
}`;

const invoicesResponse = `
    _id
    amount
    contentType
    contentTypeId
    createdAt
    customerId
    description
    email
    payment {
      name
      kind
    }
    phone
    resolvedAt
    status
    company {
      _id
      primaryName
    }
    customer {
      _id
      firstName
      lastName
      middleName
      primaryEmail
      primaryPhone
    }
    pluginData
`;

const invoices = `
query invoices($page: Int, $perPage: Int, $kind: String, $searchValue: String, $status: String) {
  invoices(page: $page, perPage: $perPage, kind: $kind, searchValue: $searchValue, status: $status) {
    ${invoicesResponse}
  }
}
`;

const invoicesTotalCount = `
query invoicesTotalCount($kind: String, $searchValue: String, $status: String) {
  invoicesTotalCount(kind: $kind, searchValue: $searchValue, status: $status) {
    byKind
    byStatus
    total
  }
}
`;

const paymentConfigQuery = `
query getPaymentConfig ($contentType: String, $contentTypeId: String) {
  getPaymentConfig(contentType: $contentType, contentTypeId: $contentTypeId) {
    _id
    paymentIds
  }
}
`;

export default {
  payments,
  paymentsTotalCountQuery,
  paymentConfigQuery,
  checkInvoice,
  invoices,
  invoicesTotalCount
};
