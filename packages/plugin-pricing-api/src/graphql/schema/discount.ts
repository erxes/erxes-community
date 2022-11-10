import {
  attachmentType,
  attachmentInput
} from '@erxes/api-utils/src/commonTypeDefs';

export const types = () => `
  ${attachmentType}
  ${attachmentInput}

  type Discount @key(fields: "_id") @cacheControl(maxAge: 3) {
    _id: String,
    name: String,
    status: String,

    createdAt: Date,
    createdBy: String,
    updatedAt: Date,
    updatedBy: String,
  }

  input DiscountAddInput {
    name: String,
    status: String,
  }

  input DiscountEditInput {
    id: String,
    name: String,
    status: String
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
