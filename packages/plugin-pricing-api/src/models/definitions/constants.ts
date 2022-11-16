export const STATUS_TYPES = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
  ALL: ['active', 'disabled', 'completed', 'archived']
};

export const AMOUNT_TYPES = {
  FIXED: 'fixed',
  PERCENTAGE: 'percentage',
  ALL: ['fixed', 'percentage']
};

export const QUANTITY_TYPES = {
  MINIMUM: 'minimum',
  EXACT: 'exact',
  ALL: ['minimum', 'fixed']
};

export const APPLY_TYPES = {
  PRODUCT: 'product',
  CATEGORY: 'category',
  ALL: ['product', 'category']
};
