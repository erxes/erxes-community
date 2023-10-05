import { __ } from 'coreui/utils';

export const PERFORM_STATUSES = {
  '': 'All',
  confirmed: 'Confirmed',
  draft: 'Draft'
};

export const JOB_TYPE_CHOISES = {
  job: 'Facture',
  end: 'End Point',
  income: 'Income',
  move: 'Move',
  outlet: 'Outlet'
};

export const PRODUCT_CATEGORIES_STATUS_FILTER = {
  disabled: 'Disabled',
  archived: 'Archived'
};

export const DURATION_TYPES = {
  hour: 'hour',
  minut: 'minut',
  day: 'day',
  month: 'month',
  all: ['minut', 'hour', 'day', 'month']
};

export const PRODUCT_CATEGORY_STATUSES = [
  { label: 'Active', value: 'active' },
  { label: 'Disabled', value: 'disabled' },
  { label: 'Archived', value: 'archived' }
];

export const menuSettings = [
  { title: 'Jobs', link: '/processes/Jobs' },
  { title: 'Flows', link: '/processes/Flows' }
];

export const menuNavs = [
  { title: 'Overall Works', link: '/processes/overallWorks' },
  { title: 'Overall Work Detail', link: '/processes/overallWorkDetail' },
  { title: 'Works', link: '/processes/works' },
  { title: 'Performances', link: '/processes/performanceList' }
];

export const ExportPerfomsHeaders = [
  { name: 'created_date', title: __('created date') },
  { name: 'created_time', title: __('created time') },
  { name: 'number', title: __('Number') },
  { name: 'pos', title: __('POS') },
  { name: 'branch', title: __('Branch') },
  { name: 'department', title: __('Department') },
  { name: 'cashier', title: __('Cashier') },
  { name: 'type', title: __('Type') },
  { name: 'billType', title: __('Bill Type') },
  { name: 'companyRD', title: __('Company RD') },
  { name: 'customerType', title: __('Customer type') },
  { name: 'customer', title: __('Customer') },
  { name: 'barcode', title: __('Barcode') },
  { name: 'subBarcode', title: __('Factor') },
  { name: 'code', title: __('Code') },
  { name: 'categoryCode', title: __('Category code') },
  { name: 'categoryName', title: __('Category name') },
  { name: 'name', title: __('Name') },
  { name: 'count', title: __('Count') },
  { name: 'firstPrice', title: __('First price') },
  { name: 'discount', title: __('Discount') },
  { name: 'discountType', title: __('Discount type') },
  { name: 'salePrice', title: __('Sale price') },
  { name: 'amount', title: __('Amount') },
  { name: 'payType', title: __('Payment type') }
];
