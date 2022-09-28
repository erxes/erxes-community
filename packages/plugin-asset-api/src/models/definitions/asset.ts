import { schemaWrapper, field } from './utils';
import { Schema } from 'mongoose';
import { attachmentSchema, customFieldSchema } from '@erxes/api-utils/src/types';
import { ASSET_GROUP_STATUSES, ASSET_STATUSES, ASSET_SUPPLY, ASSET_TYPES } from '../../common/constant/asset';

export const assetGroupSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Name' }),
    code: field({ type: String, unique: true, label: 'Code' }),
    order: field({ type: String, label: 'Order' }),
    parentId: field({ type: String, optional: true, label: 'Parent' }),
    description: field({ type: String, optional: true, label: 'Description' }),
    attachment: field({ type: attachmentSchema }),
    status: field({
      type: String,
      enum: ASSET_GROUP_STATUSES.ALL,
      optional: true,
      label: 'Status',
      default: 'active',
      esType: 'keyword',
      index: true
    }),
    createdAt: field({
      type: Date,
      default: new Date(),
      label: 'Created at'
    })
  })
);

export const assetSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Name' }),
    code: field({ type: String, unique: true, label: 'Code' }),
    groupId: field({ type: String, label: 'Group' }),
    type: field({
      type: String,
      enum: ASSET_TYPES.ALL,
      default: ASSET_TYPES.ASSET,
      label: 'Type'
    }),
    tagIds: field({
      type: [String],
      optional: true,
      label: 'Tags',
      index: true
    }),
    description: field({ type: String, optional: true, label: 'Description' }),
    sku: field({ type: String, optional: true, label: 'Stock keeping unit' }),
    unitPrice: field({ type: Number, optional: true, label: 'Unit price' }),
    customFieldsData: field({
      type: [customFieldSchema],
      optional: true,
      label: 'Custom fields data'
    }),
    createdAt: field({
      type: Date,
      default: new Date(),
      label: 'Created at'
    }),
    attachment: field({ type: attachmentSchema }),
    attachmentMore: field({ type: [attachmentSchema] }),
    status: field({
      type: String,
      enum: ASSET_STATUSES.ALL,
      optional: true,
      label: 'Status',
      default: 'active',
      esType: 'keyword',
      index: true
    }),
    supply: field({
      type: String,
      enum: ASSET_SUPPLY.ALL,
      optional: true,
      label: 'Supply',
      default: 'unlimited',
      esType: 'keyword',
      index: true
    }),
    assetCount: field({
      type: String,
      label: 'Asset Count',
      default: '0'
    }),
    minimiumCount: field({
      type: String,
      label: 'Minimium Count',
      default: '0'
    }),
    vendorId: field({ type: String, optional: true, label: 'Vendor' }),
    mergedIds: field({ type: [String], optional: true })
  })
);
