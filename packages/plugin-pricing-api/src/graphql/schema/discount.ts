import {
  attachmentType,
  attachmentInput
} from '@erxes/api-utils/src/commonTypeDefs';

export const types = () => `
  ${attachmentType}
  ${attachmentInput}

  extend type User @key(fields: "_id") {
    _id: String! @external
  }

  type Quantity {
    type: String,
    typeValue: String,
    discountValue: String,
  }

  type Price {
    type: String,
    typeValue: String,
    discountValue: String,
  }

  type Expiry {
    type: String,
    typeValue: String,
    discountValue: String,
  }

  type Repeat {
    type: String,
    value: String,
  }

  type Discount @key(fields: "_id") @cacheControl(maxAge: 3) {
    _id: String,
    name: String,
    status: String,
    type: String,
    value: Float,
    bonusProduct: String,

    applyType: String,

    products: [String],
    productsExcluded: [String],
    categories: [String],
    categoriesExcluded: [String],

    isStartDateEnabled: Boolean,
    isEndDateEnabled: Boolean,

    startDate: Date,
    endDate: Date,

    branchIds: [String],
    departmentIds: [String],
    boardId: String,
    pipelineId: String,
    stageId: String,
    
    isQuantityEnabled: Boolean,
    quantityRules: [Quantity],

    isPriceEnabled: Boolean,
    priceRules: [Price],

    isExpiryEnabled: Boolean,
    expiryRules: [Expiry],

    isRepeatEnabled: Boolean,
    repeatRules: [Repeat],

    createdAt: Date,
    createdBy: String,
    createdUser: User,
    updatedAt: Date,
    updatedBy: String,
    updatedUser: User
  }

  input QuantityInput {
    type: String,
    typeValue: String,
    discountValue: String,
  }

  input PriceInput {
    type: String,
    typeValue: String,
    discountValue: String,
  }

  input ExpiryInput {
    type: String,
    typeValue: String,
    discountValue: String,
  }

  input RepeatInput {
    type: String,
    value: String,
  }

  input DiscountAddInput {
    _id: String,
    name: String,
    status: String,
    type: String,
    value: Float,
    bonusProduct: String,

    applyType: String,

    products: [String],
    productsExcluded: [String],
    categories: [String],
    categoriesExcluded: [String],

    isStartDateEnabled: Boolean,
    isEndDateEnabled: Boolean,

    startDate: Date,
    endDate: Date,
    
    branchIds: [String],
    departmentIds: [String],
    boardId: String,
    pipelineId: String,
    stageId: String,

    isQuantityEnabled: Boolean,
    quantityRules: [QuantityInput],

    isPriceEnabled: Boolean,
    priceRules: [PriceInput],

    isExpiryEnabled: Boolean,
    expiryRules: [ExpiryInput],

    isRepeatEnabled: Boolean,
    repeatRules: [RepeatInput],
  }

  input DiscountEditInput {
    _id: String,
    name: String,
    status: String,
    type: String,
    value: Float,
    bonusProduct: String,

    isMinPurchaseEnabled: Boolean,
    minPurchaseValue: Float,

    applyType: String,

    products: [String],
    productsExcluded: [String],
    categories: [String],
    categoriesExcluded: [String],

    isStartDateEnabled: Boolean,
    isEndDateEnabled: Boolean,

    startDate: Date,
    endDate: Date,
    
    branchIds: [String],
    departmentIds: [String],
    boardId: String,
    pipelineId: String,
    stageId: String,

    isQuantityEnabled: Boolean,
    quantityRules: [QuantityInput],

    isPriceEnabled: Boolean,
    priceRules: [PriceInput],

    isExpiryEnabled: Boolean,
    expiryRules: [ExpiryInput],

    isRepeatEnabled: Boolean,
    repeatRules: [RepeatInput],
  }
`;

export const queries = `
  discounts(status: String): [Discount]
  discountDetail(id: String): Discount
`;

export const mutations = `
  discountAdd(doc: DiscountAddInput): Discount
  discountEdit(doc: DiscountEditInput): Discount
  discountRemove(id: String): Discount
`;
