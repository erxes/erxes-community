import { field } from '@erxes/api-utils/src/definitions/utils';
import { Document, Schema } from 'mongoose';

export interface IKhanbankConfig {
  name: string;
  description: string;
  departmentIds: string[];
  userIds: string[];

  // khanbank
  consumerKey: string;
  secretKey: string;
}

export interface IKhanbankConfigDocument extends IKhanbankConfig, Document {
  _id: string;
  createdAt: Date;
}

export const khanbankConfigSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, required: true }),
  description: field({ type: String }),
  createdAt: field({ type: Date, default: Date.now }),
  departmentIds: field({ type: [String] }),
  userIds: field({ type: [String] }),

  // khanbank
  consumerKey: field({ type: String, required: true }),
  secretKey: field({ type: String, required: true })
});
