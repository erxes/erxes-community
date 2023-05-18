import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface IRCFAQuestions {
  _id?: string;
  rcfaId?: string;
  question: string;
  parentId?: string;
  createdAt: Date | string;
  createdUser: string;
  modifiedAt?: Date;
  __v?: number;
}

export interface IRCFAQuestionsDocument extends IRCFAQuestions, Document {
  _id: string;
}

export const rcfaQuestionsSchema = new Schema({
  _id: field({ pkey: true }),
  rcfaId: field({ type: String, required: false }),
  question: field({ type: String, label: 'Question' }),
  parentId: field({ type: String, required: false }),
  createdAt: field({ type: Date }),
  createdUser: field({ type: String, required: false })
});
