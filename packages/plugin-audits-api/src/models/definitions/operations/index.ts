import { Schema } from 'mongoose';
import { field } from '../utils';
export const operationCategoriesSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Name' }),
  code: field({ type: String, label: 'Code' }),
  order: field({ type: String, label: 'Order' }),
  parentId: field({ type: String, label: 'Parent Id' })
});

export const operationsSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Name' }),
  description: field({ type: String, label: 'Description' }),
  code: field({ type: String, label: 'Code' }),
  order: field({ type: String, label: 'Order' }),
  categoryId: field({ type: String, label: 'Category Id' }),
  createdAt: field({ type: Date, label: 'Created At', default: Date.now })
});
