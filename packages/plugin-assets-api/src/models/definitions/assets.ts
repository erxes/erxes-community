import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface IAssets {
  _id: string;
  name: string;
  categoryId: string;
  code: string;
  unitPrice: number;
  createdAt: Date;
  modifiedAt: Date;
  createdUser: string;
  modifiedBy: string;
  usedAt: Date;
}

export interface IAssetsDocument extends IAssets, Document {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
  ownerId: string;
  searchText: string;
}

export interface IAssetsCategory {
  name: string;
  parentId?: string;
  intagible: string;
  tangible: string;
  description: string;
  code: string;
}

export interface IAssetsCategoryDocument extends IAssetsCategory, Document {
  _id: string;
  order: string;
  createdAt: Date;
}

export const assetsSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Name' }),
  categoryId: field({ type: String, label: 'categoryId' }),
  code: field({ type: String, optional: true, label: 'code' }),
  unitPrice: field({ type: Number, optional: true, label: 'unitPrice' }),
  createdAt: field({ type: Date, optional: true, label: 'crAt' }),
  modifiedAt: field({ type: Date, optional: true, label: 'modAt' }),
  createdUser: field({ type: String, optional: true, label: 'crUser' }),
  modifiedBy: field({ type: String, optional: true, label: 'modBy' }),
  usedAt: field({ type: Date, optional: true, label: 'usedAt' })
});

export const assetsCategorySchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Name' }),
  parentId: field({ type: String, optional: true, label: 'parentId' }),
  intagible: field({ type: String, optional: true, label: 'intagible' }),
  tangible: field({ type: String, optional: true, label: 'tangible' }),
  description: field({ type: String, optional: true, label: 'description' }),
  code: field({ type: String, unique: true, label: 'code' }),
  order: field({ type: String, optional: true, label: 'order' })
});
