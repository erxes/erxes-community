import * as crypto from 'crypto';
import * as QRCode from 'qrcode';

import { IModels } from '../../connectionResolver';
import { META_DATA, PAYMENT_STATUS, SOCIALPAY_ACTIONS } from '../../constants';
import { IInvoiceDocument } from '../../models/definitions/invoices';
import { IPaymentDocument } from '../../models/definitions/payments';
import { BaseAPI } from '../base';
import { ISocialPayInvoice } from '../types';

export const hmac256 = (key, message) => {
  const hash = crypto.createHmac('sha256', key).update(message);
  return hash.digest('hex');
};

export class SocialPayAPI extends BaseAPI {
  public inStoreSPTerminal: string;
  public inStoreSPKey: string;

  constructor(payment?: IPaymentDocument) {
    super(payment);
    this.inStoreSPTerminal = payment ? payment.config.inStoreSPTerminal : '';
    this.inStoreSPKey = payment ? payment.config.inStoreSPKey : '';
    this.apiUrl = META_DATA.SOCIAL_PAY.apiUrl;
  }

  async createInvoice(invoice: IInvoiceDocument) {
    const amount = invoice.amount.toString();
    let path = SOCIALPAY_ACTIONS.INVOICE_QR;

    const data: ISocialPayInvoice = {
      amount,
      checksum: hmac256(
        this.inStoreSPKey,
        this.inStoreSPTerminal + invoice.identifier + amount
      ),
      invoice: invoice.identifier,
      terminal: this.inStoreSPTerminal
    };

    if (invoice.phone) {
      data.phone = invoice.phone;
      path = SOCIALPAY_ACTIONS.INVOICE_PHONE;
      data.checksum = hmac256(
        this.inStoreSPKey,
        this.inStoreSPTerminal + invoice.identifier + amount + invoice.phone
      );
    }

    try {
      const { header, body } = await this.request({
        path,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data
      });

      if (header.code !== 200) {
        throw new Error(body.response.desc);
      }

      if (body.response.desc.includes('socialpay-payment')) {
        const qrData = await QRCode.toDataURL(body.response.desc);

        return { qrData };
      } else {
        return { text: 'Invoice has sent to SocialPay app' };
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async cancelInvoice(invoice: IInvoiceDocument) {
    const amount = invoice.amount.toString();

    const data: ISocialPayInvoice = {
      amount,
      checksum: hmac256(
        this.inStoreSPKey,
        this.inStoreSPTerminal + invoice.identifier + amount
      ),
      invoice: invoice.identifier,
      terminal: this.inStoreSPTerminal
    };

    try {
      return await this.request({
        path: SOCIALPAY_ACTIONS.INVOICE_CANCEL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async checkInvoice(data: any) {
    try {
      return await this.request({
        path: SOCIALPAY_ACTIONS.INVOICE_CHECK,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async callbackHandler(models: IModels, data: any) {
    const { resp_code, amount, checksum, invoice, terminal } = data;

    let status = PAYMENT_STATUS.PAID;

    if (resp_code !== '00') {
      status = PAYMENT_STATUS.PENDING;
    }
    try {
      const { body } = await this.checkInvoice({
        amount,
        checksum,
        invoice,
        terminal
      });

      if (body.response.resp_code !== '00') {
        status = PAYMENT_STATUS.PENDING;
        throw new Error(body.response.resp_desc);
      }

      const invoiceObj = await models.Invoices.getInvoice({
        identifier: invoice
      });

      await models.Invoices.updateOne(
        { _id: invoiceObj._id },
        { $set: { status, resolvedAt: new Date() } }
      );

      return invoiceObj;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
