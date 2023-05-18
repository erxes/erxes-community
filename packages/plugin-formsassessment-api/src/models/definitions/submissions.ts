import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface ISubmissionDocument extends Document {
  _id: string;
  cardId: string;
  userId: string;
  formId: string;
  fieldId: string;
  value: Number;
  description: string;
  isFlagged?: boolean;
}

export const submissionSchema = new Schema({
  _id: field({ pkey: true }),
  cardId: field({ type: String, label: 'Card Id' }),
  cardType: field({ type: String, label: 'Card Type' }),
  userId: field({ type: String, label: 'User Id' }),
  contentType: field({
    type: String,
    label: 'content Type of submission',
    default: 'form'
  }),
  formId: field({ type: String, label: 'Form ID' }),
  itemId: field({ type: String, label: 'item ID' }),
  assessmentId: field({ type: String, label: 'assessment ID' }),
  fieldId: field({ type: String, label: 'Form Field Id' }),
  value: field({ type: String, lablel: 'Form Field Value' }),
  description: field({ type: String, label: 'Description', optional: true }),
  isFlagged: field({ type: String, label: 'is field flagged', optional: true })
});
