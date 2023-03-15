import { BaseAPI } from '../../api/base';
import { IModels } from '../../connectionResolver';
import { META_DATA, PAYMENT_KINDS, PAYMENT_STATUS } from '../../constants';
import { IInvoiceDocument } from '../../models/definitions/invoices';
import { IPaymentDocument } from '../../models/definitions/payments';
import redis from '../../redis';

export interface IStorePayParams {
  merchantUsername: string;
  merchantPassword: string;

  appUsername: string;
  appPassword: string;

  storeId: string;
}

export class StorePayAPI extends BaseAPI {
  public username: string;
  public password: string;
  public app_username: string;
  public app_password: string;
  public store_id: string;

  constructor(args: IStorePayParams) {
    super(args);
    this.username = args.merchantUsername;
    this.password = args.merchantPassword;
    this.app_username = args.appUsername;
    this.app_password = args.appPassword;
    this.store_id = args.storeId;
    this.apiUrl = META_DATA.STOREPAY.apiUrl;
  }

  async getHeaders() {
    const { username, password, app_password, app_username, store_id } = this;
    const data = {
      username,
      password
    };

    const token = await redis.get(`storepay_token_${store_id}`);

    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }

    try {
      const res = await this.request({
        method: 'POST',
        path: 'oauth/token',
        data,
        params: {
          grant_type: 'password',
          username,
          password
        },
        headers: {
          Authorization: `Basic ${app_username}${app_password}`
        }
      });

      await redis.set(
        `storepay_token_${store_id}`,
        res.access_token,
        'EX',
        res.expires_in - 60
      );

      return {
        Authorization: `Bearer ${res.access_token}`,
        'Content-Type': 'application/json'
      };
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * create invoice on monpay
   * @param {number} amount - amount
   * @param {string} description - description
   * @return {[object]} - Returns invoice object
   * TODO: update return type
   */
  async createInvoice(invoice: IInvoiceDocument, payment: IPaymentDocument) {
    const MAIN_API_DOMAIN = process.env.DOMAIN
      ? `${process.env.DOMAIN}/gateway`
      : 'http://localhost:4000';

    try {
      const data = {
        amount: invoice.amount,
        mobileNumber: invoice.phone,
        description: invoice.description || payment.name,
        storeId: this.store_id,
        callbackUrl: `${MAIN_API_DOMAIN}/pl:payment/callback/${PAYMENT_KINDS.STOREPAY}`
      };

      const res = await this.request({
        method: 'POST',
        path: 'merchant/loan',
        data,
        headers: await this.getHeaders()
      });

      if (res.status !== 'Success') {
        const err =
          res.msgList.lenth > 0 ? res.msgList[0].text : 'Unknown error';

        throw new Error(err);
      }

      return res;
    } catch (e) {
      console.error(e);
      throw new Error(e.message);
    }
  }

  /**
   * check invoice status
   * @param {string} uuid - unique identifier of monpay invoice
   * @return {string} - Returns invoice status
   */
  async checkInvoice(invoiceNumber: string) {
    try {
      const res = await this.request({
        headers: await this.getHeaders(),
        method: 'GET',
        path: `merchant/loan/check/${invoiceNumber}`
      });

      if (!res.value) {
        return PAYMENT_STATUS.PENDING;
      }

      return PAYMENT_STATUS.PAID;
    } catch (e) {
      console.error(e);
      throw new Error(e.message);
    }
  }

  async checkLoanAmount(mobileNumber: string) {
    try {
      const res = await this.request({
        headers: await this.getHeaders(),
        method: 'POST',
        path: `user/possibleAmount`,
        data: {
          mobileNumber
        }
      });
      if (!res.value || res.value === 0) {
        throw new Error('No loan amount');
      }

      return res.value;
    } catch (e) {
      console.error(e);
      throw new Error(e.message);
    }
  }

  /**
   * request handler
   * @param {IModels} models - models
   * @param {object} queryParams - query params
   * @return {IInvoiceDocument} - Returns invoice document
   */
  async callbackHandler(models: IModels, queryParams) {
    const { id } = queryParams;

    if (!id) {
      throw new Error('id is required');
    }

    const invoice = await models.Invoices.getInvoice({
      'apiResponse.value': id
    });

    const payment = await models.Payments.getPayment(invoice.selectedPaymentId);

    if (payment.kind !== 'storepay') {
      throw new Error('Payment config type is mismatched');
    }

    try {
      const invoiceStatus = await this.checkInvoice(id);

      if (invoiceStatus !== PAYMENT_STATUS.PAID) {
        throw new Error('Payment failed');
      }

      await models.Invoices.updateOne(
        { _id: invoice._id },
        { $set: { status: invoiceStatus, resolvedAt: new Date() } }
      );

      return invoice;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
