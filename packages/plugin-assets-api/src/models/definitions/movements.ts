import { Schema } from 'mongoose';
import { field, schemaWrapper } from './utils';

export const sourceLocationsShema = new Schema(
  {
    assetId: field({ type: String, label: 'Asset Id' }),
    assetName: field({ type: String, label: 'Asset Name' }),
    branchId: field({ type: String, label: 'Branch Id' }),
    departmentId: field({ type: String, label: 'Department Id' }),
    customerId: field({ type: String, label: 'Customer Id' }),
    teamMemberId: field({ type: String, label: 'Team Member Id' }),
    companyId: field({ type: String, label: 'Company Id' })
  },
  { _id: false }
);

export const movementItemsSchema = schemaWrapper(
  new Schema({
    assetId: field({ type: String, label: 'Asset Id' }),
    assetName: field({ type: String, label: 'Asset Name' }),
    createdAt: field({ type: Date, label: 'Created At', default: new Date() }),
    branchId: field({ type: String, label: 'Branch Id' }),
    departmentId: field({ type: String, label: 'Department Id' }),
    teamMemberId: field({ type: String, label: 'Team Member Id' }),
    companyId: field({ type: String, label: 'Company Id' }),
    customerId: field({ type: String, label: 'Customer Id' }),
    movementId: field({ type: String, label: 'Movement Id' }),
    sourceLocations: field({ type: sourceLocationsShema, label: 'Source Locations' })
  })
);

export const movementSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    createdAt: field({ type: Date, label: 'Created At', default: new Date() }),
    modifiedAt: field({ type: Date, label: 'Created At', default: new Date() }),
    assetIds: field({ type: [String], label: 'Assets' }),
    movedAt: field({ type: Date, label: 'Moved Date' }),
    description: field({ type: String, label: 'Description' }),
    userId: field({ type: String, label: 'User ID' })
  })
);
