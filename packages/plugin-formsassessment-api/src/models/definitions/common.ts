export interface PaginateField {
  perPage?: number;
  searchValue?: string;
  sortDirection?: number;
  sortFromDate?: string;
  sortToDate?: string;
}
type IItemsMetricsField = {
  key: string;
  name: string;
  value: number;
  value2: number;
  logic: string;
};
export interface IItemsField {
  _id?: string;
  name?: string;
  description?: string;
  createdAt?: string;
  tagIds?: string[];
  status?: string;
  calculateMethod?: string;
  metrics?: IItemsMetricsField[];
  branchIds?: string[];
  departmentIds?: string[];
  operationIds?: string[];
}

export interface IConformityField {
  _id: string;
  cardId: string;
  boardId: string;
  pipelineId: string;
  cardType: string;
  itemIds: string[];
  groupId: string;
}

export interface IConformityParams {
  cardId: string;
  cardType: string;
  itemId?: string;
  groupId?: string;
}

export interface ISubmissionParams {
  assessmentId?: string;
  branchId?: string;
  departmentId?: string;
  operationId?: string;
  cardId: string;
  cardType: string;
  userId: string;
  itemId: string;
  submissions: {
    [key: string]: { value: number; description: string };
  };
}

export type ISubmissionsField = {
  _id: string;
  cardId: string;
  userId: string;
  formId: string;
  fieldId: string;
  value: number;
};
