import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface IRCFA {
  _id?: string;
  mainType: string;
  mainTypeId: string;
  relType: string;
  relTypeId?: string;
  status: string;
  createdAt: Date;
  createdUser: string;
  closedAt?: Date;
}

export interface IRCFADocument extends IRCFA, Document {
  _id: string;
}

export const rcfaSchema = new Schema({
  _id: field({ pkey: true }),
  mainType: field({ type: String }),
  mainTypeId: field({ type: String }),
  relType: field({ type: String }),
  relTypeId: field({ type: String, required: false }),
  status: field({ type: String }),
  createdAt: field({ type: Date }),
  createdUser: field({ type: String, required: false }),
  closedAt: field({ type: Date, required: false })
});
