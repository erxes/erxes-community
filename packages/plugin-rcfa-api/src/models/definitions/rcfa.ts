import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface IRCFAQuestions {
  _id?: string;
  title: string;
  status: string;
  createdAt: Date | string;
  createdUser: string;
  parentId?: string;
  __v?: number;
}

export interface IRCFAQuestionsDocument extends IRCFAQuestions, Document {
  _id: string;
}

export const rcfaQuestionsSchema = new Schema({
  _id: field({ pkey: true }),
  title: field({ type: String, label: 'Title' }),
  status: field({ type: String }),
  createdAt: field({ type: Date }),
  createdUser: field({ type: String, required: false }),
  parentId: field({ type: String, required: false })
});
