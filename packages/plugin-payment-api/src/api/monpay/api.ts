import { sendRequest } from '@erxes/api-utils/src';
import { IModels } from '../../connectionResolver';
import { PAYMENT_KINDS, PAYMENT_STATUS } from '../../constants';
import { IInvoiceDocument } from '../../models/definitions/invoices';
import { IPaymentDocument } from '../../models/definitions/payments';
import { IMonpayConfig, IMonpayInvoice } from '../types';
import { QR_GENERATE_URL, TOKEN_URL } from './constants';

export const generateToken = async config => {
  const { clientId, clientSecret } = config;

  const requestOptions = {
    url: TOKEN_URL,
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code: 'code'
    }
  };

  try {
    const res = await sendRequest(requestOptions);

    return res.access_token;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const createInvoice = async (
  invoice: IInvoiceDocument,
  payment: IPaymentDocument
) => {
  const MAIN_API_DOMAIN = process.env.DOMAIN
    ? `${process.env.DOMAIN}/gateway`
    : 'http://localhost:4000';

  const { username, accountId } = payment.config as IMonpayConfig;

  try {
    const data: IMonpayInvoice = {
      amount: invoice.amount,
      generateUuid: true,
      displayName: invoice.description || payment.name,
      callbackUrl: `${MAIN_API_DOMAIN}/pl:payment/callback/${PAYMENT_KINDS.MONPAY}`
    };

    const requestOptions = {
      url: QR_GENERATE_URL,
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${username}:${accountId}`).toString('base64'),
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: data
    };

    try {
      return sendRequest(requestOptions);
    } catch (e) {
      throw new Error(e.message);
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

export const checkInvoice = async (
  invoice: IInvoiceDocument,
  payment: IPaymentDocument
) => {
  const { username, accountId } = payment.config as IMonpayConfig;
};

export const monpayHandler = async (models: IModels, queryParams) => {
  const { uuid, status, amount = 0 } = queryParams;

  if (!uuid) {
    throw new Error('uuid is required');
  }

  if (status !== 'SUCCESS') {
    throw new Error('Payment failed');
  }

  const invoice = await models.Invoices.getInvoice({
    identifier: uuid
  });

  if (invoice.amount !== amount) {
    throw new Error('Payment amount is not correct');
  }

  const payment = await models.Payments.getPayment(invoice.selectedPaymentId);

  if (payment.kind !== 'monpay') {
    throw new Error('Payment config type is mismatched');
  }

  try {
    //   const response = await getInvoice(invoice.apiResponse.invoice_id, payment);
    //   if (response.invoice_status === 'CLOSED') {
    //     await models.Invoices.updateOne(
    //       { _id: invoice._id },
    //       {
    //         $set: {
    //           status: PAYMENT_STATUS.PAID,
    //           resolvedAt: new Date()
    //         }
    //       }
    //     );
    //   }
  } catch (e) {
    throw new Error(e.message);
  }
  return invoice;
};
