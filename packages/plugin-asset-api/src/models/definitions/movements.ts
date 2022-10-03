import { field, schemaWrapper } from './utils';
import { Schema } from 'mongoose';
export const assetMovementSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    assetId: field({ type: String, label: 'Asset Id' }),
    groupId: field({ type: String, label: 'Group Id' }),
    createdAt: field({ type: String, label: 'Created At', default: new Date() }),
    modifiedAt: field({ type: String, label: 'Modified At', defaul: new Date() })
  })
);
