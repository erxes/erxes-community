import * as crypto from 'crypto';
import * as QRCode from 'qrcode';

import { IModels } from '../../connectionResolver';
import { PAYMENTS, PAYMENT_STATUS } from '../constants';
import { IInvoiceDocument } from '../../models/definitions/invoices';
import { BaseAPI } from '../base';
import { IGolomtInvoice } from '../types';

export const hmac256 = (key, message) => {
  const hash = crypto.createHmac('sha256', key).update(message);
  return hash.digest('hex');
};

// export const golomtCallbackHandler = async (models: IModels, data: any) => {
//   const { resp_code, amount, checksum, invoice, terminal } = data;

//   let status = PAYMENT_STATUS.PAID;

//   if (resp_code !== '00') {
//     status = PAYMENT_STATUS.PENDING;
//   }

//   const invoiceObj = await models.Invoices.getInvoice(
//     {
//       identifier: invoice,
//     },
//     true
//   );

//   const payment = await models.Payments.getPayment(
//     invoiceObj.selectedPaymentId
//   );

//   try {
//     const api = new GolomtAPI(payment.config);
//     const res = await api.checkInvoice({
//       amount,
//       checksum,
//       invoice,
//       terminal,
//     });

//     if (res !== PAYMENT_STATUS.PAID) {
//       return invoiceObj;
//     }

//     await models.Invoices.updateOne(
//       { _id: invoiceObj._id },
//       { $set: { status, resolvedAt: new Date() } }
//     );

//     invoiceObj.status = status;

//     return invoiceObj;
//   } catch (e) {
//     throw new Error(e.message);
//   }
// };

export interface IGolomtParams {
  golomtTerminal: string;
  golomtKey: string;
}

export class GolomtAPI extends BaseAPI {
  private golomtTerminal: string;
  private golomtKey: string;

  constructor(config: IGolomtParams) {
    super(config);
    this.golomtTerminal = config.golomtTerminal;
    this.golomtKey = config.golomtKey;
    this.apiUrl = PAYMENTS.golomt.apiUrl;
  }

  async createInvoice(invoice: IInvoiceDocument) {
    const amount = invoice.amount.toString();
    const path = PAYMENTS.golomt.actions.createInvoice;

    const data: IGolomtInvoice = {
      amount,
      callback: 'http://localhost:3000',
      checksum: hmac256(
        this.golomtKey,
        this.golomtTerminal + invoice.identifier + amount
      ),
      genToken: 'N',
      returnType: 'GET',
      transactionId: invoice.identifier
    };

    console.log('************ GOLOMT DATA ', data);

    try {
      const r = await this.request({
        path,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data
      });
    } catch (e) {
      console.log('************ GOLOMT', e);
      return { error: e.message };
    }
  }

  //   async cancelInvoice(invoice: IInvoiceDocument) {
  //     const amount = invoice.amount.toString();

  //     const data: IGolomtInvoice = {
  //       amount,
  //       checksum: hmac256(
  //         this.golomtKey,
  //         this.golomtTerminal + invoice.identifier + amount
  //       ),
  //       invoice: invoice.identifier,
  //       terminal: this.golomtTerminal,
  //     };

  //     try {
  //       return await this.request({
  //         path: PAYMENTS.golomt.actions.invoiceCancel,
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         data,
  //       });
  //     } catch (e) {
  //       throw new Error(e.message);
  //     }
  //   }

  //   async checkInvoice(data: any) {
  //     try {
  //       const { body } = await this.request({
  //         path: PAYMENTS.golomt.actions.invoiceCheck,
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         data,
  //       });

  //       if (body.response.resp_code !== '00') {
  //         throw new Error(body.response.resp_desc);
  //       }

  //       return PAYMENT_STATUS.PAID;
  //     } catch (e) {
  //       throw new Error(e.message);
  //     }
  //   }

  //   async manualCheck(invoice: IInvoiceDocument) {
  //     const amount = invoice.amount.toString();

  //     const data: IGolomtInvoice = {
  //       amount,
  //       checksum: hmac256(
  //         this.golomtKey,
  //         this.golomtTerminal + invoice.identifier + amount
  //       ),
  //       invoice: invoice.identifier,
  //       terminal: this.golomtTerminal,
  //     };

  //     try {
  //       const { body } = await this.request({
  //         path: PAYMENTS.golomt.actions.invoiceCheck,
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         data,
  //       });

  //       if (body.error) {
  //         return body.error.errorDesc;
  //       }

  //       if (body.response.resp_code !== '00') {
  //         throw new Error(body.response.resp_desc);
  //       }

  //       return PAYMENT_STATUS.PAID;
  //     } catch (e) {
  //       throw new Error(e.message);
  //     }
  //   }
}
