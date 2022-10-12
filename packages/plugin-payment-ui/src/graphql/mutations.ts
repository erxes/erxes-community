const commonParamDefs = `$name: String!, $kind: String!, $status: String, $config: JSON`;
const commonParams = `name: $name, kind: $kind, status: $status, config: $config`;

const createInvoiceParamDefs = `$paymentId: String!, $amount: Float!, $description: String!, $phone: String, $customerId: String, $companyId: String`;

const createInvoiceParams = `paymentId: $paymentId, amount: $amount, description: $description, phone: $phone, customerId: $customerId, companyId: $companyId`;

const paymentsAdd = `
mutation paymentsAdd(${commonParamDefs}) {
  paymentsAdd(${commonParams}) {
    _id
  }
}
`;

const paymentsEdit = `
mutation PaymentEdit($id: String!, ${commonParamDefs}) {
  paymentsEdit(id: $id, ${commonParams}) {
    _id
  }
}
`;

const paymentRemove = `
mutation paymentRemove($id: String!) {
  paymentRemove(id: $id)
}`;

const createInvoice = `
mutation createInvoice(${createInvoiceParamDefs}) {
  createInvoice(${createInvoiceParams})
}
`;

const setPaymentConfig = `
mutation SetPaymentConfig($contentType: String!, $contentTypeId: String!) {
  setPaymentConfig(contentType: $contentType, contentTypeId: $contentTypeId) {
    _id
    paymentIds
  }
}
`;

export default {
  paymentsAdd,
  paymentsEdit,
  paymentRemove,
  createInvoice,
  setPaymentConfig
};
