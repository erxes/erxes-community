import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface ILastViewedItem {
  productId: string;
  customerId: string;
}

export interface ILastViewedItemDocument extends ILastViewedItem, Document {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export const lastvieweditemSchema = new Schema({
  _id: field({ pkey: true }),
  productId: field({ type: String, label: 'ProductId' }),
  customerId: field({ type: String, label: 'CustomerId' })
});
