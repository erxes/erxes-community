import { field, schemaWrapper } from './utils';
import { Schema } from 'mongoose';
export const assetMovementSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    assetId: field({ type: String, label: 'Asset Id' }),
    assetName: field({ type: String, label: 'Asset Name' }),
    userTyp: { type: String, label: 'User Type' },
    createdAt: field({ type: String, label: 'Created At', default: new Date() }),
    modifiedAt: field({ type: String, label: 'Modified At', defaul: new Date() }),
    branchId: field({ type: String, label: 'Branch Id' }),
    departmentId: field({ type: String, label: 'Department Id' }),
    teamMemberId: field({ type: String, label: 'Team Member Id' }),
    companyId: field({ type: String, label: 'Company Id' }),
    customerId: field({ type: String, label: 'Customer Id' })
  })
);
