import { Document, Schema } from 'mongoose';
import { field } from './utils';
import { STATUS, AMOUNT_TYPE, QUANTITY_TYPE } from './constants';

export interface IDiscount {
  name: string;
  status: string;
  amountType: string;
  amountValue: number;
  products?: string[];
  productCategories?: string[];
  productsExcluded: string[];

  quantityType?: string;
  quantityValue?: number;
  minPurchaseEnabled?: boolean;
  minPurchaseValue?: number;
  departmentIds?: string[];
  branchIds?: string[];
  unitIds?: string[];

  createdBy?: string;
  updatedBy?: string;
}

export interface IDiscountDocument extends IDiscount, Document {
  _id: string;
}

export const discountSchema = new Schema({
  _id: field({ pkey: true }),

  // Contents
  name: field({ type: String, label: 'Name' }),
  status: field({
    type: String,
    enum: STATUS.ALL,
    default: STATUS.ACTIVE,
    label: 'Status'
  }),
  amountType: field({
    type: String,
    enum: AMOUNT_TYPE.ALL,
    default: AMOUNT_TYPE.FIXED,
    label: 'Amount Type'
  }),
  amountValue: field({
    type: Number,
    label: 'Amount Value'
  }),
  products: field({
    type: [String],
    label: 'Products'
  }),
  productCategories: field({
    type: [String],
    label: 'Product Categories'
  }),
  productsExcluded: field({
    type: [String],
    label: 'Excluded Products'
  }),

  // Rules
  quantityType: field({
    type: String,
    enum: QUANTITY_TYPE.ALL,
    label: 'Quantity Type'
  }),
  quantityValue: field({
    type: Number,
    label: 'Quantity Value'
  }),
  minPurchaseEnabled: field({
    type: Boolean,
    label: 'Minimum purchase'
  }),
  minPurchaseValue: field({
    type: Number,
    label: 'Minimum purchase value'
  }),

  // Locations
  departmentIds: field({
    type: [String],
    label: 'Department Ids'
  }),
  branchIds: field({
    type: [String],
    label: 'Branch Ids'
  }),
  unitIds: field({
    type: [String],
    label: 'Unit Ids'
  }),

  // Timestamps
  createdAt: field({ type: Date, default: new Date(), label: 'Created At' }),
  createdBy: field({ type: String, label: 'Created By' }),
  updatedAt: field({ type: Date, default: new Date(), label: 'Updated At' }),
  updatedBy: field({ type: String, label: 'Updated By' })
});
