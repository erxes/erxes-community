export const STATUS_TYPES = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DRAFT: 'draft',
  COMPLETED: 'completed',
  ALL: ['active', 'draft', 'archived', 'completed']
};

export const AMOUNT_TYPES = {
  FIXED: 'fixed',
  SUBTRACTION: 'subtraction',
  PERCENTAGE: 'percentage',
  BONUS: 'bonus',
  ALL: ['fixed', 'subtraction', 'percentage', 'bonus']
};

export const APPLY_TYPES = {
  PRODUCT: 'product',
  CATEGORY: 'category',
  ALL: ['product', 'category']
};

export const RULE_TYPES = {
  MINIMUM: 'minimum',
  EXACT: 'exact',
  EVERY: 'every',
  ALL: ['minimum', 'exact', 'every']
};

export const EXPIRY_TYPES = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  ALL: ['day', 'week', 'month', 'year']
};
