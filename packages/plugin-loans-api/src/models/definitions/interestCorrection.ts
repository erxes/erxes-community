import { Document, Schema } from 'mongoose';
import { schemaHooksWrapper, field } from './utils';

export interface IInterestCorrection {
  description: string;
  invDate: Date;
  amount: number;
  type: string;
}

export interface IInterestCorrectionDocument
  extends IInterestCorrection,
    Document {
  _id: string;
  createdAt?: Date;
  createdBy?: string;
}

export const InterestCorrectionSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    number: field({
      type: String,
      label: 'Number',
      index: true
    }),
    description: field({ type: String, optional: true, label: 'Description' }),
    invDate: field({
      type: Date,
      default: new Date(),
      label: 'Created at'
    }),
    amount: field({ type: Number, min: 0, label: 'total' }),
    type: field({ type: String, label: 'type' }),
    createdAt: field({
      type: Date,
      default: () => new Date(),
      label: 'Created at'
    }),
    createdBy: { type: String, optional: true, label: 'created member' }
  }),
  'erxes_interestCorrectionSchema'
);
