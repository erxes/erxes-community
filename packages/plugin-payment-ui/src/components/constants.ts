import MonpayForm from './form/MonpayForm';
import PaypalForm from './form/PaypalForm';
import QpayForm from './form/QpayForm';
import SocialPayForm from './form/SocialPayForm';
import StorepayForm from './form/StorePayForm';

export const PAYMENTCONFIGS = [
  {
    name: 'QPay',
    description:
      'When you already have a QPay account, you can use this payment method to receive payments in Mongolia.',
    isAvailable: true,
    kind: 'qpay',
    logo: 'images/payments/qpay.png',
    createModal: QpayForm,
    createUrl: '/settings/payments/createQpay',
    category: 'Payment method',
    link: 'https://www.qpay.mn'
  },
  {
    name: 'QPay Quick QR',
    description:
      "If you don't have a QPay account, you can directly register for QPay here and receive payments in Mongolia using this payment method.",
    isAvailable: true,
    kind: 'qpayQuickqr',
    logo: 'images/payments/qpay.png',
    createModal: QpayForm,
    createUrl: '/settings/payments/createQpay',
    category: 'Payment method'
  },
  {
    name: 'SocialPay',
    description:
      'Fast and easy way to receive money using the recipient’s mobile number.',
    isAvailable: true,
    kind: 'socialpay',
    logo: 'images/payments/socialpay.png',
    createModal: SocialPayForm,
    createUrl: '/settings/payments/createSocialPay',
    category: 'Payment method',
    link: 'https://www.golomtbank.com/retail/digital-bank/socialpay'
  },
  {
    name: 'MonPay',
    description: 'Easy, fast and reliable payment by QR scan',
    isAvailable: true,
    kind: 'monpay',
    logo: 'images/payments/monpay.png',
    createModal: MonpayForm,
    createUrl: '/settings/payments/createMonPay',
    category: 'Payment method',
    link:
      'mailto:%20Merchantservice@mobifinance.mn?subject=MonPay%20Merchant%20Registration&body=Dear%20MonPay%20Team,%0D%0A%0D%0AI%20would%20like%20to%2'
  },
  {
    name: 'Storepay',
    description:
      'Storepay is a service with no additional interest or fees, where you pay in installments for the goods and services you purchase.',
    isAvailable: true,
    kind: 'storepay',
    logo: 'images/payments/storepay.png',
    createModal: StorepayForm,
    createUrl: '/settings/payments/createStorePay',
    category: 'Payment method'
  },
  {
    name: 'Qpay Wechat Pay',
    description: 'Receive payments in Mongolia through the WeChat Pay',
    isAvailable: false,
    kind: 'wechatpay',
    logo: 'images/payments/wechatpay.png',
    createModal: '',
    createUrl: '/settings/payments/createWechatpay',
    category: 'Payment method'
  },
  {
    name: 'Paypal',
    description: 'Paypal payment method',
    isAvailable: false,
    kind: 'paypal',
    logo: 'images/payments/paypal.png',
    createModal: PaypalForm,
    createUrl: '/settings/payments/createPaypal',
    category: 'Payment method'
  }
];

export const PAYMENT_KINDS = {
  QPAY: 'qpay',
  QPAY_QUICK_QR: 'qpayQuickqr',
  SOCIALPAY: 'socialpay',
  MONPAY: 'monpay',
  STOREPAY: 'storepay',
  WECHATPAY: 'wechatpay',
  PAYPAL: 'paypal',

  ALL: [
    'qpay',
    'socialpay',
    'monpay',
    'storepay',
    'wechatpay',
    'paypal',
    'qpayQuickqr'
  ]
};

export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  REFUNDED: 'refunded',
  FAILED: 'failed',

  ALL: ['paid', 'pending', 'refunded', 'failed']
};
