import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface IDynamic {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  expiryDate: Date;
  checked: boolean;
  typeId: string;
}

export interface IDynamicDocument extends IDynamic, Document {
  _id: string;
}

export const msdynamicSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String }),
  description: field({ type: String }),

  createdAt: field({
    type: Date,
    default: Date.now,
    label: 'Registered at'
  }),
  expiryDate: field({ type: Date }),
  typeId: field({ type: String }),
  checked: field({ type: Boolean })
});
