export const PAYMENTCONFIGS = [
  {
    name: 'QPay',
    description:
      'When you already have a QPay account, you can use this payment method to receive payments in Mongolia.',
    isAvailable: true,
    kind: 'qpay',
    logo: 'images/payments/qpay.png',
    createModal: 'qpay',
    createUrl: '/settings/payments/createQpay',
    category: 'Payment method',
    link: 'https://www.qpay.mn'
  },
  {
    name: 'QPay',
    description:
      "If you don't have a QPay account, You can register for a QPay account and use this payment method to receive payments in Mongolia.",
    isAvailable: true,
    kind: 'qpayVendor',
    logo: 'images/payments/qpay.png',
    createModal: 'qpayVendor',
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
    createModal: 'socialpay',
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
    createModal: 'monPay',
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
    createModal: 'storepay',
    createUrl: '/settings/payments/createStorePay',
    category: 'Payment method'
  },
  {
    name: 'Qpay Wechat Pay',
    description: 'Receive payments in Mongolia through the WeChat Pay',
    isAvailable: false,
    kind: 'wechatpay',
    logo: 'images/payments/wechatpay.png',
    createModal: 'wechatpay',
    createUrl: '/settings/payments/createWechatpay',
    category: 'Payment method'
  },
  {
    name: 'Paypal',
    description: 'Paypal payment method',
    isAvailable: false,
    kind: 'paypal',
    logo: 'images/payments/paypal.png',
    createModal: 'paypal',
    createUrl: '/settings/payments/createPaypal',
    category: 'Payment method'
  }
];

export const PAYMENT_KINDS = {
  QPAY: 'qpay',
  SOCIALPAY: 'socialpay',
  MONPAY: 'monpay',
  STOREPAY: 'storepay',
  WECHATPAY: 'wechatpay',
  PAYPAL: 'paypal',

  ALL: ['qpay', 'socialpay', 'monpay', 'storepay', 'wechatpay', 'paypal']
};

export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  REFUNDED: 'refunded',
  FAILED: 'failed',

  ALL: ['paid', 'pending', 'refunded', 'failed']
};
