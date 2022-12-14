export const PRODUCT_TYPES = {
  PRODUCT: 'product',
  SERVICE: 'service',
  ALL: ['product', 'service']
};

export const PRODUCT_STATUSES = {
  ACTIVE: 'active',
  DELETED: 'deleted',
  ALL: ['active', 'deleted']
};

export const PRODUCT_CATEGORY_STATUSES = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
  ARCHIVED: 'archived',
  ALL: ['active', 'disabled', 'archived']
};

export const ORDER_TYPES = {
  TAKE: 'take',
  EAT: 'eat',
  SAVE: 'save',
  DELIVERY: 'delivery',
  ALL: ['take', 'eat', 'save', 'delivery']
};

export const DEFAULT_SEX_CHOICES = [
  { label: 'Not known', value: 0 },
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
  { label: 'Not applicable', value: 9 }
];

const STATUSES = [
  { label: 'Active', value: 'Active' },
  { label: 'Deleted', value: 'Deleted' },
  { label: 'deleted', value: 'deleted' }
];

export const CUSTOMER_SELECT_OPTIONS = {
  SEX: [
    ...DEFAULT_SEX_CHOICES,
    { label: 'co/co', value: 10 },
    { label: 'en/en', value: 11 },
    { label: 'ey/em', value: 12 },
    { label: 'he/him', value: 13 },
    { label: 'he/them', value: 14 },
    { label: 'she/her', value: 15 },
    { label: 'she/them', value: 16 },
    { label: 'they/them', value: 17 },
    { label: 'xie/hir', value: 18 },
    { label: 'yo/yo', value: 19 },
    { label: 'ze/zir', value: 20 },
    { label: 've/vis', value: 21 },
    { label: 'xe/xem', value: 22 }
  ],
  EMAIL_VALIDATION_STATUSES: [
    { label: 'Valid', value: 'valid' },
    { label: 'Invalid', value: 'invalid' },
    { label: 'Accept all unverifiable', value: 'accept_all_unverifiable' },
    { label: 'Unverifiable', value: 'unverifiable' },
    { label: 'Unknown', value: 'unknown' },
    { label: 'Disposable', value: 'disposable' },
    { label: 'Catch all', value: 'catchall' },
    { label: 'Bad syntax', value: 'badsyntax' },
    { label: 'Not checked', value: 'Not checked' }
  ],
  PHONE_VALIDATION_STATUSES: [
    { label: 'Valid', value: 'valid' },
    { label: 'Invalid', value: 'invalid' },
    { label: 'Unknown', value: 'unknown' },
    { label: 'Can receive sms', value: 'receives_sms' },
    { label: 'Unverifiable', value: 'unverifiable' },
    { label: 'Accept all unverifiable', value: 'accept_all_unverifiable' }
  ],
  LEAD_STATUS_TYPES: [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'attemptedToContact' },
    { label: 'Working', value: 'inProgress' },
    { label: 'Bad Timing', value: 'badTiming' },
    { label: 'Unqualified', value: 'unqualified' },
    { label: 'Unknown', value: '' },
    { label: 'Connected', value: 'connected' },
    { label: 'Open', value: 'open' },
    { label: 'Open deal', value: 'openDeal' },
    { label: 'Working', value: 'working' }
  ],
  STATUSES,
  DO_NOT_DISTURB: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Unknown', value: '' }
  ],
  HAS_AUTHORITY: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Unknown', value: '' }
  ],
  STATE: [
    { label: 'Visitor', value: 'visitor' },
    { label: 'Lead', value: 'lead' },
    { label: 'Customer', value: 'customer' }
  ]
};

// ????????-?? ???????????????? ??????????
export const BILL_TYPES = {
  CITIZEN: '1', // ???????????? ???????? ????????????
  ENTITY: '3', // ???????????????????????? ???????? ????????????
  INVOICE: '5', // ???????????????????????? ???????? ????????????
  INNER: '9', // ???????????? ???????? ??????
  ALL: ['1', '3', '5', '9']
};

export const ORDER_RETURN_TYPES = {
  HARD: 'hard',
  SALE: 'sale',
  SOFT: 'soft'
};

export const ORDER_STATUSES = {
  NEW: 'new',
  DOING: 'doing',
  REDOING: 'reDoing',
  DONE: 'done',
  COMPLETE: 'complete',

  ALL: ['new', 'doing', 'done', 'complete', 'reDoing'],
  FULL: ['paid', 'done', 'complete']
};

export const ORDER_ITEM_STATUSES = {
  NEW: 'new',
  CONFIRM: 'confirm',
  DONE: 'done',

  ALL: ['new', 'done', 'confirm']
};

export const DISTRICTS = {
  '01': '????????????????',
  '02': '????????-??????????',
  '03': '????????????????????',
  '04': '????????????',
  '05': '????????-??????????',
  '06': '??????????????????',
  '07': '????????????',
  '08': '????????????????',
  '09': '????????????',
  '10': '????????????????????',
  '11': '????????????????',
  '12': '?????????????????? ??????????',
  '13': '??????????????',
  '14': '??????',
  '15': '??????',
  '16': '????????',
  '17': '??????????????',
  '18': '????????????',
  '19': '????????????-??????',
  '20': '??????????',
  '32': '????????????????????',
  '23': '??????-??????',
  '24': '????????????????',
  '25': '??????????????????',
  '26': '??????????????',
  '27': '????????????????',
  '28': '????????????????????',
  '29': '????????????',
  '34': '????????????????????????????',
  '35': '??????????????????'
};

export const DISTRICTS_REVERSE = {
  ????????????????: '01',
  '????????-??????????': '02',
  ????????????????????: '03',
  ????????????: '04',
  '????????-??????????': '05',
  ??????????????????: '06',
  ????????????: '07',
  ????????????????: '08',
  ????????????: '09',
  ????????????????????: '10',
  ????????????????: '11',
  '?????????????????? ??????????': '12',
  ??????????????: '13',
  ??????: '14',
  ??????: '15',
  ????????: '16',
  ??????????????: '17',
  ????????????: '18',
  '????????????-??????': '19',
  ??????????: '20',
  ????????????????????: '32',
  '??????-??????': '23',
  ????????????????: '24',
  ??????????????????: '25',
  ??????????????: '26',
  ????????????????: '27',
  ????????????????????: '28',
  ????????????: '29',
  ????????????????????????????: '34',
  ??????????????????: '35'
};

export const ORDER_ORIGINS = {
  POS: '',
  KIOSK: 'kiosk',
  ALL: ['', 'kiosk']
};
