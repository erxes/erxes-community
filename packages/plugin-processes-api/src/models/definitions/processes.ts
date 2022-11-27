import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils';
import { IJobRefer, productsDataSchema } from './jobs';
import { IFlow, IFlowDocument } from './flows';

export interface ICurrentJob {
  id: string;
  jobId: string;
  quantity: number;
  dueDate: Date;
  nextWorkIds: string[];
  type: string;
  jobConfig: {
    jobReferId?: string;
    productId?: string;
    subProcessId?: string;
    inBranchId: string;
    outBranchId: string;
    inDepartmentId: string;
    outDepartmentId: string;
    durationType: string;
    duration: number;
    quantity?: number;
    uomId?: string;
  };
  style: object;
}

export interface ICurrentJobDocument extends ICurrentJob {
  jobRefer: IJobRefer;
}

export interface IProcess {
  flowId: string;
  flow: IFlowDocument;
  dueDate: Date;
  branchId: string;
  departmentId: string;
  productId: string;
  uomId?: string;
  quantity: number;
  status: string;
  isSub: boolean;
  referInfos: any;
  currentJobs?: ICurrentJob[];
}

export interface IProcessDocument extends IProcess, Document {
  _id: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  currentFlow: IFlow;
}

export const currenctJobSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    nextJobIds: { type: [String] },
    config: { type: Object },
    style: { type: Object },
    icon: { type: String, optional: true },
    label: { type: String, optional: true },
    description: { type: String, optional: true }
  },
  { _id: false }
);

export const processSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    flowId: field({ type: String, label: 'flow' }),
    flow: field({ type: Object, label: 'flow' }),
    name: { type: String, required: true },
    categoryId: field({
      type: String,
      label: 'Category',
      optional: true,
      index: true
    }),
    productId: field({
      type: String,
      label: 'Product',
      optional: true,
      index: true
    }),
    status: field({ type: String, label: 'Status' }),
    isSub: field({ type: Boolean, optional: true, label: 'Is Sub Process' }),
    processValidation: field({
      type: String,
      optional: true,
      label: 'ProcessJob status'
    }),
    createdAt: { type: Date, default: new Date(), label: 'Created date' },
    createdBy: { type: String },
    updatedAt: { type: Date, default: new Date(), label: 'Updated date' },
    updatedBy: { type: String },
    jobs: field({ type: [currenctJobSchema], optional: true, label: 'Jobs' }),
    latestBranchId: { type: String, optional: true },
    latestDepartmentId: { type: String, optional: true },
    latestResultProducts: {
      type: {
        type: [productsDataSchema],
        optional: true,
        label: 'Result products'
      }
    },
    latestNeedProducts: {
      type: {
        type: [productsDataSchema],
        optional: true,
        label: 'Need products'
      }
    }
  }),
  'erxes_processes'
);

// for tags query. increases search speed, avoids in-memory sorting
processSchema.index({ status: 1 });
