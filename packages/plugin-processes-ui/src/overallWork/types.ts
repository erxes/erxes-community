import { QueryResponse } from '@erxes/ui/src/types';
import { IBranch, IDepartment } from '@erxes/ui/src/team/types';

export interface IWork {
  _id?: string;
  name?: string;
  status: string;
  dueDate: Date;
  startAt: Date;
  endAt: Date;
  flowId: string;
  flow: any;
  count: string;
  intervalId?: string;
  interval: any;

  inBranchId?: string;
  inDepartmentId?: string;
  outBranchId?: string;
  outDepartmentId?: string;
  inBranch: IBranch;
  inDepartment: IDepartment;
  outBranch: IBranch;
  outDepartment: IDepartment;
  needProducts?: any[];
  resultProducts?: any[];
}

export type IWorkDet = {
  _id: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
} & IWork;

export type WorksQueryResponse = {
  works: IWork[];
  loading: boolean;
  refetch: () => void;
} & QueryResponse;

export type WorkDetailQueryResponse = {
  workDetail: IWorkDet;
  loading: boolean;
  refetch: () => void;
};

export type ListQueryVariables = {
  page?: number;
  perPage?: number;
  search?: string;
};

export type WorksSummaryQueryResponse = {
  worksSummary: any;
  loading: boolean;
  refetch: () => void;
};
