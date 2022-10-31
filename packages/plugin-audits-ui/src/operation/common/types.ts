export type IOperations = {
  _id: string;
  name: string;
  description: string;
  code: string;
  order: string;
  createdAt: string;
};

export type IOperationCategories = {
  _id: string;
  name: string;
  code: string;
  order: string;
  parentId: string;
  createdAt: string;
};

export type OperationCategoriesQueryResponse = {
  loading: boolean;
  refetch: () => void;
  auditOperationsCategories: IOperationCategories[];
  auditOperationsCategoriesTotalCount: number;
};
export type OperationsQueryResponse = {
  loading: boolean;
  refetch: () => void;
  auditOperations: IOperations[];
  auditOperationsTotalCount: number;
};

export type RemoveOperationCategoryMutationResponse = {
  remove: (mutation: { variables: { _id: string } }) => Promise<any>;
};

export type OperationsCategoryQueryResponse = {
  loadin: boolean;
  refetch: () => void;
  auditOperationsCategory: IOperationCategories;
};
