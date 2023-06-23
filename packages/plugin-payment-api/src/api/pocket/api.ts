import { IModels } from '../../connectionResolver';
import { PAYMENTS, PAYMENT_STATUS } from '../constants';
import { IInvoiceDocument } from '../../models/definitions/invoices';
import redis from '../../redis';
import { BaseAPI } from '../base';
import { IPocketInvoice } from '../types';
import { sendRequest } from '@erxes/api-utils/src/requests';

export const pocketCallbackHandler = async (models: IModels, data: any) => {
  const { identifier } = data;

  if (!identifier) {
    throw new Error('Invoice id is required');
  }

  const invoice = await models.Invoices.getInvoice(
    {
      identifier
    },
    true
  );

  const payment = await models.Payments.getPayment(invoice.selectedPaymentId);

  if (payment.kind !== 'pocket') {
    throw new Error('Payment config type is mismatched');
  }

  try {
    const api = new PocketAPI(payment.config);
    const status = await api.checkInvoice(invoice);

    if (status !== PAYMENT_STATUS.PAID) {
      return invoice;
    }

    await models.Invoices.updateOne(
      { _id: invoice._id },
      {
        $set: {
          status,
          resolvedAt: new Date()
        }
      }
    );

    invoice.status = status;

    return invoice;
  } catch (e) {
    throw new Error(e.message);
  }
};

export interface IPocketConfig {
  pocketMerchant: string;
  pocketClientId: string;
  pocketClientSecret: string;
}

export class PocketAPI extends BaseAPI {
  private pocketMerchant: string;
  private pocketClientId: string;
  private pocketClientSecret: any;
  private domain?: string;

  constructor(config: IPocketConfig, domain?: string) {
    super(config);

    this.pocketMerchant = config.pocketMerchant;
    this.pocketClientId = config.pocketClientId;
    this.pocketClientSecret = config.pocketClientSecret;
    this.domain = domain;
    this.apiUrl = PAYMENTS.pocket.apiUrl;
  }

  async getHeaders() {
    const { pocketClientId, pocketClientSecret, pocketMerchant } = this;
    const data = {
      client_id: pocketClientId,
      client_secret: pocketClientSecret,
      grant_type: 'client_credentials'
    };

    const token = await redis.get(`pocket_token_${pocketMerchant}`);

    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }

    try {
      const requestOptions = {
        url: 'https://sso.invescore.mn',
        method: 'POST',
        body: data
      };

      const res = await sendRequest(requestOptions);

      await redis.set(
        `pocket_token_${pocketMerchant}`,
        res.access_token,
        'EX',
        res.expires_in - 60
      );

      return {
        Authorization: `Bearer ${res.access_token}`,
        'Content-Type': 'application/json'
      };
    } catch (e) {
      console.error('error ', e);
      throw new Error(e.message);
    }
  }

  async createInvoice(invoice: IInvoiceDocument) {
    try {
      const data: IPocketInvoice = {
        amount: invoice.amount,
        info: invoice.description || 'тэмдэглэл'
      };

      const res = await this.request({
        method: 'POST',
        path: PAYMENTS.pocket.actions.invoice,
        headers: await this.getHeaders(),
        data
      });

      return {
        ...res,
        qrData: res.qr
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  async checkInvoice(invoice: IInvoiceDocument) {
    // return PAYMENT_STATUS.PAID;
    try {
      const res = await this.request({
        method: 'GET',
        path: `${PAYMENTS.pocket.actions.invoice}/${invoice.apiResponse.invoice_id}`,
        headers: await this.getHeaders()
      });

      if (res.invoice_status === 'CLOSED') {
        return PAYMENT_STATUS.PAID;
      }

      return PAYMENT_STATUS.PENDING;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async manualCheck(invoice: IInvoiceDocument) {
    try {
      const res = await this.request({
        method: 'GET',
        path: `${PAYMENTS.pocket.actions.invoice}/${invoice.apiResponse.invoice_id}`,
        headers: await this.getHeaders()
      });

      if (res.invoice_status === 'CLOSED') {
        return PAYMENT_STATUS.PAID;
      }

      return PAYMENT_STATUS.PENDING;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async cancelInvoice(invoice: IInvoiceDocument) {
    try {
      await this.request({
        method: 'DELETE',
        path: `${PAYMENTS.pocket.actions.invoice}/${invoice.apiResponse.invoice_id}`,
        headers: await this.getHeaders()
      });
    } catch (e) {
      return { error: e.message };
    }
  }
}
