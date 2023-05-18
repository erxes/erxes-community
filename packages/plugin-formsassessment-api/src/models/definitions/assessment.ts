import { Document, Schema } from 'mongoose';
import { field } from './utils';

interface AssessmentCommonTypes {
  status: string;
  statusColor: string;
  resultScore: number;
  createdAt: string;
  cloesedAt: string;
}

export interface IAssessmentsDocument extends AssessmentCommonTypes, Document {
  _id: string;
  itemId: string[];
  groupId: string;
  branchIds: string[];
  departmentIds: string[];
  operationIds: string[];
  itemsGroups: any[];
  cardId: string;
  cardType: string;
  isSplittedUsers: boolean;
}

export interface IAssessmentItems extends AssessmentCommonTypes, Document {
  assetId: string;
  itemId: string;
  status: string;
  s;
  statusColor: string;
  resultScore: number;
  totalScore: number;
}

export interface IAssessmentItemssDocument extends IAssessmentItems {
  _id: string;
}

export const commonAssessmentSchema = {
  _id: field({ pkey: true }),
  status: field({ type: String, label: 'Status', default: 'In Progress' }),
  statusColor: field({
    type: String,
    label: 'Status Status Color',
    default: '#3B85F4'
  }),
  resultScore: field({ type: Number, label: 'Result Score', default: 0 }),
  totalScore: field({ type: Number, label: 'Total Score', default: 0 }),
  createdAt: field({ type: Date, label: 'Created At', default: Date.now }),
  closedAt: field({ type: Date, optional: true, label: 'Closed At' })
};

export const itemsSchema = new Schema({
  assessmentId: field({ type: String, label: 'assessment Id' }),
  itemId: field({ type: String, label: 'Item Id' }),
  ...commonAssessmentSchema
});

export const itemsGroupSchema = new Schema({
  assessmentId: field({ type: String, label: 'assessment Id' }),
  groupId: field({ type: String, label: 'items group Id' }),
  assignedUserIds: field({
    type: [String],
    label: 'Assigned User Id',
    optional: true
  }),
  ...commonAssessmentSchema
});

export const assessmentsSchema = new Schema({
  cardId: field({ type: String, label: 'Card Id' }),
  cardType: field({ type: String, label: 'Card Type' }),
  itemId: field({
    type: String,
    label: 'item Id'
  }),
  groupId: field({ type: String, label: 'Item Group Id' }),
  isSplittedUsers: field({ type: Boolean, label: 'Is Splitted Team Members' }),
  branchId: field({ type: String, label: 'branchId', optional: true }),
  departmentId: field({ type: String, label: 'departmentId', optional: true }),
  operationId: field({ type: String, label: 'operationId', optional: true }),
  ...commonAssessmentSchema
});
