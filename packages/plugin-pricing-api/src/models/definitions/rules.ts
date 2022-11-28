import { Schema } from 'mongoose';
import { field } from './utils';
import { RULE_TYPES, EXPIRY_TYPES } from './constants';

export interface IQuantity {
  type: string;
  typeValue: string;
  discountValue: string;
}

export interface IPrice {
  type: string;
  typeValue: string;
  discountValue: string;
}

export interface IExpiry {
  type: string;
  typeValue: string;
  discountValue: string;
}

export interface IRepeat {
  type: string;
  value: string;
}

export const quantitySchema = new Schema({
  _id: field({ pkey: true }),
  type: field({ type: String, enum: RULE_TYPES.ALL }),
  typeValue: field({ type: String }),
  discountValue: field({ type: String })
});

export const priceSchema = new Schema({
  _id: field({ pkey: true }),
  type: field({ type: String, enum: RULE_TYPES.ALL }),
  typeValue: field({ type: String }),
  discountValue: field({ type: String })
});

export const expirySchema = new Schema({
  _id: field({ pkey: true }),
  type: field({ type: String }),
  typeValue: field({ type: String, enum: EXPIRY_TYPES.ALL }),
  discountValue: field({ type: String })
});

export const repeatSchema = new Schema({
  _id: field({ pkey: true }),
  type: field({ type: String }),
  value: field({ type: String })
});
