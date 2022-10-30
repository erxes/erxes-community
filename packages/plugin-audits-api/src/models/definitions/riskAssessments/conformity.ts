import { Document, Schema } from 'mongoose';
import { field } from '../utils';

export const riskConformitiesSchema = new Schema({
  _id: field({ pkey: true }),
  cardId: field({ type: String, label: 'Card Id' }),
  cardType: field({ type: String, label: 'Card Type' }),
  riskAssessmentId: field({ type: String, label: 'Answer Risk assessment Ids' }),
  createdAt: field({ type: Date, label: 'Created At', default: Date.now })
});

export const formSubmissionSchema = new Schema({
  _id: field({ pkey: true }),
  cardId: field({ type: String, label: 'Card Id' }),
  cardType: field({ type: String, label: 'Card Type' }),
  userId: field({ type: String, label: 'User Id' }),
  formId: field({ type: String, label: 'Form Id' }),
  riskAssessmentId: field({ type: String, label: 'risk assessment Id' }),
  fieldId: field({ type: String, label: 'Form Field Id' }),
  value: field({ type: String, lablel: 'Form Field Value' })
});
