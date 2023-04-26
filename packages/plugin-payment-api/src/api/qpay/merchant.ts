import { MerchantBaseAPI } from './merchantBase';

export type QPayMerchantConfig = {
  username: string;
  password: string;
};

export const meta = {
  apiUrl: 'https://sandbox-quickqr.qpay.mn',
  apiVersion: 'v2',

  paths: {
    auth: 'auth/token',
    refresh: 'auth/refresh',
    createCompany: 'merchant/company',
    createPerson: 'merchant/person',
    getMerchant: 'merchant',
    merchantList: 'merchant/list',

    invoice: 'invoice'
  }
};

export class QpayMerchantAPI extends MerchantBaseAPI {
  constructor(config: QPayMerchantConfig) {
    super(config);
  }

  async createCompany(args: {
    registerNumber: string;
    name: string;
    mccCode: string;
    city: string;
    district: string;
    address: string;
    phone: string;
    email: string;
  }) {
    return await this.makeRequest({
      method: 'POST',
      path: meta.paths.createCompany,
      data: {
        ...args,
        register_number: args.registerNumber,
        mcc_code: args.mccCode
      }
    });
  }

  //   {
  //     "merchant_id": "8e85aaa9-aebb-43d4-ad24-f942215deffb",
  //     "amount": 100,
  //     "currency": "MNT",
  //     "customer_name": "TDB",
  //     "customer_logo": "",
  //     "callback_url": "https://notify@test.mn/pay",
  //     "description": "9 сарын үйлчилгээний төлбөр",
  //     "mcc_code": "",
  //     "bank_accounts": [
  //         {
  //             "default": true,
  //             "account_bank_code": "040000",
  //             "account_number": "490000869",
  //             "account_name": "test account2",
  //             "is_default": true
  //         }
  //     ]
  // }

  async createInvoice(args: {
    merchantId: string;
    amount: number;
    mccCode: string;
    description: string;
    callbackUrl: string;
  }) {
    return await this.makeRequest({
      method: 'POST',
      path: meta.paths.invoice,
      data: {
        merchant_id: 'f49b3f35-af6e-442f-b35e-52d42ea617e3',
        branch_code: 'BRANCH_001',
        amount: 100,
        currency: 'MNT',
        customer_name: 'TDB',
        customer_logo: '',
        callback_url: 'https://notify@test.mn/pay',
        description: '9 сарын үйлчилгээний төлбөр',
        mcc_code: '',
        bank_accounts: [
          {
            default: true,
            account_bank_code: '040000',
            account_number: '490000869',
            account_name: 'test account2',
            is_default: true
          }
        ]
      }
    });
  }

  async get(_id: string) {
    return await this.makeRequest({
      method: 'GET',
      path: `${meta.paths.getMerchant}/${_id}`
    });
  }
}
