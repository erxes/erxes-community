export const ASSET_GROUP_STATUSES = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
  ARCHIVED: 'archived',
  ALL: ['active', 'disabled', 'archived']
};

export const ASSET_STATUSES = {
  ACTIVE: 'active',
  DELETED: 'deleted',
  ALL: ['active', 'deleted']
};

export const ASSET_TYPES = {
  ASSET: 'asset',
  SERVICE: 'service',
  ALL: ['asset', 'service']
};

export const ASSET_SUPPLY = {
  UNIQUE: 'unique',
  LIMITED: 'limited',
  UNLIMITED: 'unlimited',
  ALL: ['unique', 'limited', 'unlimited']
};

export const ASSET_INFO = {
  code: 'Code',
  name: 'Name',
  type: 'Type',
  group: 'Group',
  parent: 'Parent',
  vendor: 'Vendor',
  description: 'Description',
  sku: 'Sku',
  productCount: 'Product count',

  ALL: [
    { field: 'code', label: 'Code' },
    { field: 'name', label: 'Name' },
    { field: 'type', label: 'Type' },
    { field: 'group', label: 'Group' },
    { field: 'parent', label: 'Parent' },
    { field: 'vendor', label: 'Vendor' },
    { field: 'description', label: 'Description' },
    { field: 'sku', label: 'Sku' },
    { field: 'productCount', label: 'Product count' }
  ]
};

export const EXTEND_FIELDS = [
  {
    _id: Math.random(),
    name: 'groupName',
    label: 'Group Name',
    type: 'string'
  },
  {
    _id: Math.random(),
    name: 'parentName',
    label: 'Parent Name',
    type: 'string'
  },
  {
    _id: Math.random(),
    name: 'tag',
    label: 'Tag',
    type: 'string'
  }
];
