import { Document, Schema } from 'mongoose';
import { field } from './utils';
import { STATUS } from './constants';

export interface IDiscount {
  name: string;
  status: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface IDiscountDocument extends IDiscount, Document {
  _id: string;
}

export const discountSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Name' }),
  status: field({
    type: String,
    enum: STATUS.ALL,
    default: STATUS.ACTIVE,
    label: 'Status'
  }),

  // Timestamps
  createdAt: field({ type: Date, default: new Date(), label: 'Created At' }),
  createdBy: field({ type: String, label: 'Created By' }),
  updatedAt: field({ type: Date, default: new Date(), label: 'Updated At' }),
  updatedBy: field({ type: String, label: 'Updated By' })
});
