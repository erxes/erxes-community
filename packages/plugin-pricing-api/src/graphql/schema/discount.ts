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

  type Discount @key(fields: "_id") @cacheControl(maxAge: 3) {
    _id: String,
    name: String,
    status: String,
    amountValue: Float,
    amountType: String,
    products: [String],
    productCategories: [String],
    productsExcluded: [String],

    quantityType: String,
    quantityValue: Float,
    minPurchaseEnabled: Boolean,
    minPurchaseValue: Float,

    departmentIds: [String],
    branchIds: [String],
    unitIds: [String],

    createdAt: Date,
    createdBy: String,
    createdUser: User,
    updatedAt: Date,
    updatedBy: String,
    updatedUser: User
  }

  input DiscountAddInput {
    name: String,
    status: String,
    amountValue: Float,
    amountType: String,
    products: [String],
    productCategories: [String],
    productsExcluded: [String],

    quantityType: String,
    quantityValue: Float,
    minPurchaseEnabled: Boolean,
    minPurchaseValue: Float,

    departmentIds: [String],
    branchIds: [String],
    unitIds: [String]
  }

  input DiscountEditInput {
    id: String,
    name: String,
    status: String,
    amountValue: Float,
    amountType: String,
    products: [String],
    productCategories: [String],
    productsExcluded: [String],

    quantityType: String,
    quantityValue: Float,
    minPurchaseEnabled: Boolean,
    minPurchaseValue: Float,

    departmentIds: [String],
    branchIds: [String],
    unitIds: [String],
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
