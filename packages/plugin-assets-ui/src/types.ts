import { QueryResponse } from '@erxes/ui/src/types';

export interface IAssetCategory {
  _id: string;
  name: string;
  order: string;
  code: string;
  description?: string;
  parentId?: string;
  isRoot: boolean;
  createdAt: Date;
}

export interface IAssets {
  _id: string;
  name: string;
  categoryId: string;
  code: string;
  unitPrice: number;
  createdAt: Date;
  modifiedAt: Date;
  createdUser: string;
  modifiedBy: string;
  usedAt: Date;
}

export type AssetCategoriesQueryResponse = {
  assetsCategories: IAssetCategory[];
} & QueryResponse;

export type AssetsCategoryRemoveMutationResponse = {
  assetsCategoryDelete: (mutation: {
    variables: { _id: string };
  }) => Promise<any>;
};

export type AssetsCategoriesCountQuery = {
  assetsTotalCount: number;
  loading: boolean;
  refetch: () => void;
};

export type AssetsQueryResponse = {
  assets: IAssets[];
} & QueryResponse;

export type AssetsRemoveMutationResponse = {
  assetsDelete: (mutation: { variables: { _id: string } }) => Promise<any>;
};

export type AssetsCountQuery = {
  assetsTotalCount: number;
  loading: boolean;
  refetch: () => void;
};

export type DetailQueryResponse = {
  assetsDetail: IAssets;
  loading: boolean;
};

export type RemoveMutationVariables = {
  assetIds: string[];
};

export type RemoveMutationResponse = {
  assetsDelete: (params: {
    variables: RemoveMutationVariables;
  }) => Promise<any>;
};
