import { QueryResponse } from '@erxes/ui/src/types';
import { IJobRefer } from '../job/types';
import {
  IProduct,
  IProductCategory as IProductCategoryC
} from '@erxes/ui-products/src/types';

export type IProductCategory = IProductCategoryC & {};

interface IConfig {
  jobReferId?: string;
  productId?: string;
  flowId?: string;

  quantity?: number;

  durationType: string;
  duration: number;
  inBranchId?: string;
  inDepartmentId?: string;
  outBranchId?: string;
  outDepartmentId?: string;
}

export interface IJob {
  id: string;
  type: string;
  config: IConfig;
  nextJobIds?: string[];
  style?: any;
  label?: string;
  description?: string;
  icon?: string;
}

export interface IJobDocument extends IJob {
  jobRefer: IJobRefer;
}

export interface IFlow {
  name: string;
  categoryId?: string;
  productId?: string;
  product?: IProduct;
  status: string;
  flowJobStatus?: boolean;
  jobs?: IJob[];
}

export interface IFlowDocument extends IFlow, Document {
  _id: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

// FLOW

export type FlowsQueryResponse = {
  flows: IFlowDocument[];
} & QueryResponse;

export type FlowsAllQueryResponse = {
  flowsAll: IFlowDocument[];
} & QueryResponse;

export type FlowDetailQueryResponse = {
  flowDetail: IFlowDocument;
} & QueryResponse;

export type FlowsAddMutationResponse = {
  flowsAdd: (mutation: { variables: IFlow }) => Promise<any>;
};

export type FlowsEditMutationResponse = {
  flowsEdit: (mutation: { variables: IFlowDocument }) => Promise<any>;
};

export type flowTotalCountQueryResponse = {
  flowTotalCount: number;
} & QueryResponse;

export type FlowCategoriesQueryResponse = {
  productCategories: IProductCategory[];
} & QueryResponse;

export type FlowCategoriesCountQueryResponse = {
  flowCategoriesTotalCount: number;
} & QueryResponse;

// mutation types
export type flowsRemoveMutationResponse = {
  flowsRemove: (mutation: { variables: { flowIds: string[] } }) => Promise<any>;
};

export type FlowCategoriesRemoveMutationResponse = {
  flowCategoriesRemove: (mutation: {
    variables: { _id: string };
  }) => Promise<any>;
};

export type DetailQueryResponse = {
  jobReferDetail: IJobRefer;
  loading: boolean;
};

export type CategoryDetailQueryResponse = {
  productCategoryDetail: IProductCategory;
  loading: boolean;
};
