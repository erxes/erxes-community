export const commonPaymentParamDefs = `$name: String!, $kind: String!, $status: String, $config: JSON`;
export const commonPaymentParams = `name: $name, kind: $kind, status: $status, config: $config`;

export const createInvoiceParamDefs = `$paymentIds: [String], $amount: Float!, $description: String, $phone: String, $customerId: String, $companyId: String`;
export const createInvoiceParams = `paymentIds: $paymentIds, amount: $amount, description: $description, phone: $phone, customerId: $customerId, companyId: $companyId`;

export const paymentConfigFields = `
  _id
  contentType
  contentTypeId
  contentName
  paymentIds
`;
