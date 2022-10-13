import { gql } from '@apollo/client';

import {
  commonPaymentParamDefs,
  commonPaymentParams,
  createInvoiceParamDefs,
  createInvoiceParams,
  paymentConfigFields
} from './common';

const paymentsAdd = gql`
mutation paymentsAdd(${commonPaymentParamDefs}) {
  paymentsAdd(${commonPaymentParams}) {
    _id
  }
}
`;

const paymentsEdit = gql`
mutation PaymentEdit($id: String!, ${commonPaymentParamDefs}) {
  paymentsEdit(id: $id, ${commonPaymentParams}) {
    _id
  }
}
`;

const paymentRemove = gql`
  mutation paymentRemove($id: String!) {
    paymentRemove(id: $id)
  }
`;

const createInvoice = gql`
mutation createInvoice(${createInvoiceParamDefs}) {
  createInvoice(${createInvoiceParams})
}
`;

const setPaymentConfig = gql`
  mutation SetPaymentConfig($contentType: String!, $contentTypeId: String!) {
    setPaymentConfig(contentType: $contentType, contentTypeId: $contentTypeId) {
      _id
      paymentIds
    }
  }
`;

const paymentConfigsAdd = gql`
mutation PaymentConfigsAdd($contentType: String!, $contentTypeId: String!, $paymentIds: [String]) {
  paymentConfigsAdd(contentType: $contentType, contentTypeId: $contentTypeId, paymentIds: $paymentIds) {
    ${paymentConfigFields}
  }
}
`;

const paymentConfigsEdit = gql`
  mutation PaymentConfigsEdit($id: String!, $paymentIds: [String]) {
    paymentConfigsEdit(_id: $id, paymentIds: $paymentIds) {
      ${paymentConfigFields}
    }
  }
`;

const paymentConfigsRemove = gql`
  mutation PaymentConfigsRemove($id: String!) {
    paymentConfigsRemove(_id: $id)
  }
`;

export default {
  paymentsAdd,
  paymentsEdit,
  paymentRemove,
  createInvoice,
  setPaymentConfig,

  paymentConfigsAdd,
  paymentConfigsEdit,
  paymentConfigsRemove
};
