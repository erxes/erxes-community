import { field, schemaWrapper } from './utils';
import { Schema } from 'mongoose';

export const movementAssetsSchema = schemaWrapper(
  new Schema({
    assetId: field({ type: String, label: 'Asset Id' }),
    assetName: field({ type: String, label: 'Asset Name' }),
    createdAt: field({ type: String, label: 'Created At', default: new Date() }),
    modifiedAt: field({ type: String, label: 'Modified At', defaul: new Date() }),
    branchId: field({ type: String, label: 'Branch Id' }),
    departmentId: field({ type: String, label: 'Department Id' }),
    teamMemberId: field({ type: String, label: 'Team Member Id' }),
    companyId: field({ type: String, label: 'Company Id' }),
    customerId: field({ type: String, label: 'Customer Id' })
  })
);

export const movementSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    createdAt: field({ type: String, label: 'Created At', default: new Date() }),
    modifiedAt: field({ type: String, label: 'Modified At', defaul: new Date() }),
    assetIds: field({ type: [String], label: 'Assets' }),
    movedAt: field({ type: String, label: 'Moved Date' }),
    description: field({ type: String, label: 'Description' }),
    userId: field({ type: String, label: 'User ID' })
  })
);
