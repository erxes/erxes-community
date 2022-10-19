import { __ } from '@erxes/ui/src';

export const ASSET_CATEGORY_STATUSES = [
  { label: 'Active', value: 'active' },
  { label: 'Disabled', value: 'disabled' },
  { label: 'Archived', value: 'archived' }
];

export const TYPES = {
  ASSET: 'asset',
  SERVICE: 'service',
  ALL: ['asset', 'service']
};

export const ASSET_SUPPLY = [
  { label: 'Unlimited', value: 'unlimited' },
  { label: 'Limited', value: 'limited' },
  { label: 'Unique', value: 'unique' }
];

export const ASSET_INFO = {
  name: 'Name',
  type: 'Type',
  category: 'category',
  code: 'Code',
  description: 'Description',
  unitPrice: 'UnitPrice',
  vendor: 'Vendor',

  ALL: [
    { field: 'name', label: 'Name' },
    { field: 'type', label: 'Type' },
    { field: 'category', label: 'Category' },
    { field: 'code', label: 'Code' },
    { field: 'description', label: 'Description' },
    { field: 'unitPrice', label: 'UnitPrice' },
    { field: 'vendor', label: 'Vendor' }
  ]
};

export const ASSET_TYPE_CHOISES = {
  asset: 'Asset',
  service: 'Service'
};

export const ASSET_CATEGORY_STATUS_FILTER = {
  disabled: 'Disabled',
  archived: 'Archived'
};

export const breadcrumb = [
  { title: __('Settings'), link: '/settings' },
  { title: __('Asset & Movement') }
];

export const MOVEMENT_TYPES = [];

export const USER_TYPES = [
  {
    label: 'Team Member',
    key: 'TeamMember',
    name: 'teamMemberId'
  },
  {
    label: 'Customer',
    key: 'Customer',
    name: 'customerId'
  },
  {
    label: 'Company',
    key: 'Company',
    name: 'compnayId'
  }
];

export const menuMovements = [
  { title: 'Movements', link: '/asset-movements' },
  { title: 'Assets', link: '/asset-movement-items' }
];
