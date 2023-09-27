import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface IAssetsConfig {
  code: string;
  value: any;
}

export interface IAssetsConfigDocument extends IAssetsConfig, Document {
  _id: string;
}

// Mongoose schemas ===========

export const assetsConfigSchema = new Schema({
  _id: field({ pkey: true }),
  code: field({ type: String, unique: true }),
  value: field({ type: Object })
});

// etc codes: IS_UOM, DEFAULT_UOM,
