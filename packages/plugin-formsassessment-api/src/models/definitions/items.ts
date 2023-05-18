import { Document, Schema } from 'mongoose';
import { field } from './utils';

type IMetric = {
  _id: string;
  name: string;
  value: string;
  value2?: string;
  logic: string;
  color: string;
};

type IItemForms = {
  _id: string;
  formId: string;
  calculateMethod: string;
  percentWeight?: number;
  metrics: IMetric[];
};
export interface IItemsDocument extends Document {
  _id: string;
  createdAt: Date;
  name: string;
  description: string;
  tagIds: [string];
  departmentIds: [string];
  branchIds: [string];
  operationIds: [string];
  status: string;
  metrics?: IMetric[];
  calculateMethod?: string;
  forms?: IItemForms[];
  isWithDescription?: boolean;
}

export interface IConfigsDocument extends Document {
  _id: string;
  boardId: string;
  pipelineId: string;
  stageId?: string;
  customFieldId?: string;
  configs: any[];
  itemId?: string;
  itemIds: string[];
  groupId?: string;
}

export interface IItemsGroupDocument extends Document {
  itemIds: string[];
  percentWeight?: number;
  metrics: IMetric[];
  calculateMethod: string;
}

export interface IItemsGroupsDocument extends Document {
  _id: string;
  code: string;
  order: string;
  calculateMethod: string;
  metrics: IMetric[];
  groups: IItemsGroupDocument[];
  tagIds: string[];
  ignoreZeros: boolean;
}

export const metricsSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Logic Name' }),
  value: field({ type: Number, label: 'Logic Value' }),
  value2: field({ type: Number, label: 'Logic Value When Between Logic' }),
  logic: field({ type: String, label: 'Logic Logic' }),
  color: field({ type: String, label: 'Logic Status Color' })
});

const itemFormsSchema = new Schema({
  _id: field({ pkey: true }),
  formId: field({ type: String, name: 'Form ID' }),
  calculateMethod: field({ type: String, label: 'Calculate Method' }),
  metrics: field({
    type: [metricsSchema],
    label: 'metrics',
    optional: true
  }),
  percentWeight: field({ type: Number, label: 'Percent Weight' })
});

export const itemsSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Name' }),
  description: field({ type: String, label: 'Description' }),
  createdAt: field({ type: Date, default: Date.now, label: 'Created At' }),
  tagIds: field({ type: [String], label: 'Tag Ids' }),
  operationIds: field({ type: [String], label: 'OperationIDs' }),
  branchIds: field({ type: [String], label: ' BranchIDs' }),
  departmentIds: field({ type: [String], label: 'DepartmentIDs' }),
  calculateMethod: field({
    type: String,
    optional: true,
    label: 'Calculate Method'
  }),
  metrics: field({
    type: [metricsSchema],
    optinal: true,
    label: 'metrics'
  }),
  forms: field({
    type: [itemFormsSchema],
    label: 'Assessment Forms'
  }),
  isWithDescription: field({ type: Boolean, label: 'Is With Description' })
});

const configsFieldsSchema = new Schema({
  _id: field({ pkey: true }),
  value: field({ type: String, label: 'Field Value' }),
  label: field({ type: String, label: 'Field Label' }),
  itemId: field({
    type: String,
    label: 'Field Config Item Id'
  }),
  itemIds: field({ type: [String], label: 'Item Ids' }),
  groupId: field({
    type: String,
    label: 'Field Config Items Group Id'
  })
});

export const configsSchema = new Schema({
  _id: field({ pkey: true }),
  cardType: field({ type: String, label: 'Card Type' }),
  boardId: field({ type: String, label: 'Board Id' }),
  pipelineId: field({ type: String, label: 'Pipeline Id' }),
  stageId: field({ type: String, label: 'Stage Id', optional: true }),
  itemId: field({
    type: String,
    optional: true,
    label: 'item id'
  }),
  itemIds: field({
    type: [String],
    label: 'item Ids',
    optional: true
  }),
  groupId: field({
    type: String,
    optional: true,
    label: 'items group id'
  }),
  customFieldId: field({ type: String, label: 'Custom Field Id' }),
  configs: field({
    type: [configsFieldsSchema],
    label: 'Custom Field Config'
  }),
  createdAt: field({ type: Date, label: 'Created At', default: new Date() }),
  modifiedAt: field({ type: Date, label: 'Modified At', default: new Date() })
});

const itemGroupsSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Name' }),
  itemIds: field({ type: [String], label: 'itemIds' }),
  percentWeight: field({
    type: Number,
    label: 'Percent Weight',
    optional: true
  }),
  calculateMethod: field({ type: String, labels: 'Calculate Method' }),
  metrics: field({
    type: [metricsSchema],
    labels: 'item groups calculate methods'
  })
});

export const itemsGroupsSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Name' }),
  description: field({ type: String, label: 'Description' }),
  tagIds: field({ type: [String], label: 'Tag Ids' }),
  calculateMethod: field({ type: String, label: 'Calculate Method' }),
  metrics: field({
    type: [metricsSchema],
    label: 'Calculate Logics'
  }),
  groups: field({ type: [itemGroupsSchema], label: 'items groups' }),
  createdAt: field({ type: Date, label: 'Created At', default: Date.now }),
  modifiedAt: field({ type: Date, label: 'Modified At', default: Date.now }),
  ignoreZeros: field({ type: Boolean, label: 'Ignore Zeros', optional: true })
});
