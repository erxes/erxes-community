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

  async createCustomer(args: {
    registerNumber: string;
    name: string;
    mccCode: string;
    city: string;
  }) {
    return await this.makeRequest({
      method: 'POST',
      path: meta.paths.createPerson,
      data: {
        register_number: 'УЗ89122490',
        last_name: 'Бат-Эрдэнэ',
        first_name: 'Соёмбо',
        mcc_code: '0110',
        city: 'Ulaanbaatar',
        district: 'Sukhbaatar',
        address: '6 хороо 14-10',
        phone: '99391924',
        email: 'e11iot.soko@gmail.com',
        bank_accounts: [
          {
            default: true,
            account_bank_code: '040000',
            account_number: '410054178',
            account_name: 'Соёмбо',
            is_default: true
          }
        ]
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
        merchant_id: '79e4336a-614f-43c2-bbce-09a716be2c05',
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
            account_number: '410054178',
            account_name: 'Соёмбо',
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
