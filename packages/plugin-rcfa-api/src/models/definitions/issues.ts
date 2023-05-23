import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface IRCFAIssues {
  _id?: string;
  rcfaId?: string;
  issue: string;
  parentId?: string;
  createdAt: string;
  __v?: number;
}

export interface IRCFAIssuesDocument extends IRCFAIssues, Document {
  _id: string;
}

export const rcfaIssuessSchema = new Schema({
  _id: field({ pkey: true }),
  rcfaId: field({ type: String, optional: true }),
  issue: field({ type: String, label: 'Issue' }),
  parentId: field({ type: String, optional: true }),
  createdAt: field({ type: Date, default: Date.now })
});
