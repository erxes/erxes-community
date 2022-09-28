export const ASSET_GROUP_STATUSES = [
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
  group: 'group',
  code: 'Code',
  description: 'Description',
  sku: 'Sku',
  unitPrice: 'UnitPrice',
  vendor: 'Vendor',

  ALL: [
    { field: 'name', label: 'Name' },
    { field: 'type', label: 'Type' },
    { field: 'group', label: 'Group' },
    { field: 'code', label: 'Code' },
    { field: 'description', label: 'Description' },
    { field: 'sku', label: 'Sku' },
    { field: 'unitPrice', label: 'UnitPrice' },
    { field: 'vendor', label: 'Vendor' }
  ]
};
