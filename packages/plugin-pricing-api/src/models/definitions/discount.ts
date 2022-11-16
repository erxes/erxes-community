import { Document, Schema } from 'mongoose';
import { field } from './utils';
import {
  STATUS_TYPES,
  AMOUNT_TYPES,
  QUANTITY_TYPES,
  APPLY_TYPES
} from './constants';

export interface IDiscount {
  name: string;
  status: string;
  amountType: string;
  amountValue: number;

  applyType: string;

  products: string[];
  productsExcluded: string[];
  categories: string[];
  categoriesExcluded: string[];

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
    enum: STATUS_TYPES.ALL,
    default: STATUS_TYPES.ACTIVE,
    label: 'Status'
  }),
  amountType: field({
    type: String,
    enum: AMOUNT_TYPES.ALL,
    default: AMOUNT_TYPES.FIXED,
    label: 'Amount Type'
  }),
  amountValue: field({
    type: Number,
    label: 'Amount Value'
  }),

  applyType: field({
    type: String,
    enum: APPLY_TYPES.ALL,
    default: APPLY_TYPES.PRODUCT,
    label: 'Apply Type'
  }),

  products: field({
    type: [String],
    label: 'Products'
  }),
  productsExcluded: field({
    type: [String],
    label: 'Excluded Products'
  }),
  categories: field({
    type: [String],
    label: 'Product Categories'
  }),
  categoriesExcluded: field({
    type: [String],
    label: 'Excluded Categories'
  }),

  // Rules
  quantityType: field({
    type: String,
    enum: QUANTITY_TYPES.ALL,
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

  // Intervals

  // Timestamps
  createdAt: field({ type: Date, default: new Date(), label: 'Created At' }),
  createdBy: field({ type: String, label: 'Created By' }),
  updatedAt: field({ type: Date, default: new Date(), label: 'Updated At' }),
  updatedBy: field({ type: String, label: 'Updated By' })
});
