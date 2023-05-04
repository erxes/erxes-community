import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface IRCFAQuestions {
  title: string;
}

export interface IRCFAQuestionsDocument extends IRCFAQuestions, Document {
  _id: string;
}

export const rcfaQuestionsSchema = new Schema({
  _id: field({ pkey: true }),
  title: field({ type: String, label: 'Title' })
});

// title, status, createdAt, parentId
