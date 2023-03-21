export const PAYMENTCONFIGS = [
  {
    name: 'Qpay',
    description: 'Qpay payment method',
    isAvailable: true,
    kind: 'qpay',
    logo: '/images/payments/qpay.png',
    createModal: 'qpay',
    createUrl: '/settings/payments/createQpay',
    category: 'Payment method'
  },
  {
    name: 'Social pay',
    description: 'SocialPay payment method',
    isAvailable: true,
    kind: 'socialpay',
    logo: '/images/payments/socialpay.png',
    createModal: 'socialpay',
    createUrl: '/settings/payments/createSocialPay',
    category: 'Payment method'
  },
  {
    name: 'Mon pay',
    description: 'Monpay payment method',
    isAvailable: true,
    kind: 'monpay',
    logo: '/images/payments/monpay.png',
    createModal: 'monPay',
    createUrl: '/settings/payments/createMonPay',
    category: 'Payment method'
  },
  {
    name: 'Storepay',
    description: 'Storepay payment method',
    isAvailable: true,
    kind: 'storepay',
    logo: '/images/payments/storepay.png',
    createModal: 'storepay',
    createUrl: '/settings/payments/createStorePay',
    category: 'Payment method'
  }
];

export const PAYMENT_KINDS = {
  QPAY: 'qpay',
  SOCIALPAY: 'socialpay',
  MONPAY: 'monpay',
  STOREPAY: 'storepay',

  ALL: ['qpay', 'socialpay', 'monpay', 'storepay']
};

export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  REFUNDED: 'refunded',
  FAILED: 'failed',

  ALL: ['paid', 'pending', 'refunded', 'failed']
};
