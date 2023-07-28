import { QueryResponse } from '@erxes/ui/src/types';

export interface IAccountDoc {
  _id?: string;
  type: string;
  name?: string;
  createdAt?: Date;
  customFieldsData?: any;
}

export interface IAccount {
  _id: string;
  name: string;
  type: string;
  categoryId: string;
  code: string;
  category: IAccountCategory;
  customFieldsData?: any;
  currency?: number;
  isBalance?: boolean;
  closePercent?: number;
  journal?: string;
  createdAt: Date;
  accountCount: number;
}

export interface IAccountCategory {
  _id: string;
  name: string;
  order: string;
  code: string;
  status: string;
  parentId?: string;
  createdAt: Date;
  isRoot: boolean;
  accountCount: number;
}

export type DetailQueryResponse = {
  accountDetail: IAccount;
  loading: boolean;
};

export type Counts = {
  [key: string]: number;
};
type AccountCounts = {
  bySegment: Counts;
};
// query types

export interface IAccountCategory {
  _id: string;
  name: string;
  order: string;
  code: string;
  status: string;
  parentId?: string;
  createdAt: Date;
  isRoot: boolean;
  accountCount: number;
}
export type AccountsQueryResponse = {
  accounts: IAccount[];
} & QueryResponse;

export type AccountsCountQueryResponse = {
  accountsTotalCount: number;
} & QueryResponse;

export type AccountsGroupCountsQueryResponse = {
  accountsGroupsCounts: AccountCounts;
} & QueryResponse;

export type AccountCategoriesCountQueryResponse = {
  accountCategoriesTotalCount: number;
} & QueryResponse;

export type MutationUomVariables = {
  _id?: string;
  name: string;
  code: string;
};

export type MutationVariables = {
  _id?: string;
  type: string;
  name?: string;
  code?: string;
  createdAt?: Date;
};

// mutation types

export type AddMutationResponse = {
  addMutation: (mutation: { variables: MutationVariables }) => Promise<any>;
};

export type EditMutationResponse = {
  editMutation: (mutation: { variables: MutationVariables }) => Promise<any>;
};

export type AccountRemoveMutationResponse = {
  accountsRemove: (mutation: {
    variables: { accountIds: string[] };
  }) => Promise<any>;
};

export type AccountCategoryRemoveMutationResponse = {
  accountCategoryRemove: (mutation: {
    variables: { _id: string };
  }) => Promise<any>;
};
export type AccountAddMutationResponse = {
  accountAdd: (params: { variables: IAccountDoc }) => Promise<void>;
};
export type AccountCategoriesQueryResponse = {
  accountCategories: IAccountCategory[];
} & QueryResponse;

export type AccountsQueryResponses = {
  accounts: IAccount[];
} & QueryResponse;

export type CategoryDetailQueryResponse = {
  accountCategoryDetail: IAccountCategory;
  loading: boolean;
};

export type MergeMutationVariables = {
  accountIds: string[];
  accountFields: IAccount;
};

export type MergeMutationResponse = {
  accountsMerge: (params: {
    variables: MergeMutationVariables;
  }) => Promise<any>;
};

export type IConfigsMap = { [key: string]: any };

export type IAccountsConfig = {
  _id: string;
  code: string;
  value: any;
};

// query types
export type AccountsConfigsQueryResponse = {
  accountsConfigs: IAccountsConfig[];
  loading: boolean;
  refetch: () => void;
};
