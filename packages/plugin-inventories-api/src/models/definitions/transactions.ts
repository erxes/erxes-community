import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils';

export interface ITransactionCreateParams extends ITransaction {
  products: {
    productId: string;
    count: number;
    preCount: number;
    uomId: string;
    isDebit: boolean;
  }[];
}

export interface ITransaction {
  date: Date;
  number: string;
  description: string;
  journal: string;
  parentId: string;
  ptrId: string;
  childData: any;
  contactType: string;
  contactId: string;
  status: string;
  contentType: string;
  contentId: string;
  taxInfo: any;
  assignedUserIds: string[];
  paymentData: any;
}

export interface ITransactionDocument extends ITransaction, Document {
  _id: string;
  createdAt: Date;
  createdBy: String;
  modifiedAt: Date;
  modifiedBy: String;
}

export const transactionSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    number: field({ type: String, default: '', label: 'number' }),
    description: field({ type: String, label: 'description' }),
    journal: field({ type: String, label: 'journal' }),
    parentId: field({ type: String, label: 'parentId' }),
    ptrId: field({ type: String, label: 'ptrId' }),
    childData: field({ type: Object, label: 'childData' }),
    contactType: field({ type: String, label: 'contactType' }),
    contactId: field({ type: String, label: 'contactId' }),
    status: field({ type: String, label: 'status' }),
    contentType: field({ type: String, label: 'contentType' }),
    contentId: field({ type: String, label: 'contentId' }),
    taxInfo: field({ type: Object, label: 'taxInfo' }),
    assignedUserIds: field({ type: [String], label: 'assignedUserIds' }),
    paymentData: field({ type: Object, label: 'paymentData' }),
    branchId: field({ type: String, default: '', label: 'Branch' }),
    departmentId: field({ type: String, default: '', label: 'Department' }),

    createdAt: { type: Date, default: new Date(), label: 'Created date' }
  }),
  'erxes_transactions'
);

// for transactionSchema query. increases search speed, avoids in-memory sorting
transactionSchema.index({
  branchId: 1,
  departmentId: 1,
  contentType: 1,
  contentId: 1
});
