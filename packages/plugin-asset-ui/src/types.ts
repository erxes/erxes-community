import {
  IAsset as IAssetC,
  IAssetCategory as IAssetCategoryC,
  IAssetDoc as IAssetDocC,
  IUom as IUomC
} from '@erxes/ui-assets/src/types';
import { QueryResponse } from '@erxes/ui/src/types';

export type IAssetDoc = IAssetDocC & {};

export type IAsset = IAssetC & {};

export type IAssetCategory = IAssetCategoryC & {};

export type IUom = IUomC & {};

// query types

export type AssetsQueryResponse = {
  assets: IAsset[];
} & QueryResponse;

export type AssetsCountQueryResponse = {
  assetsTotalCount: number;
} & QueryResponse;

export type AssetCategoriesCountQueryResponse = {
  assetCategoriesTotalCount: number;
} & QueryResponse;

// UOM

export type UomsQueryResponse = {
  uoms: IUom[];
} & QueryResponse;

export type UomsCountQueryResponse = {
  uomsTotalCount: number;
} & QueryResponse;

export type MutationVariables = {
  _id?: string;
  type: string;
  name?: string;
  description?: string;
  sku?: string;
  createdAt?: Date;
};

export type MutationUomVariables = {
  _id?: string;
  name: string;
  code: string;
};

// mutation types

export type AddMutationResponse = {
  addMutation: (mutation: { variables: MutationVariables }) => Promise<any>;
};

export type EditMutationResponse = {
  editMutation: (mutation: { variables: MutationVariables }) => Promise<any>;
};

export type AssetRemoveMutationResponse = {
  assetsRemove: (mutation: { variables: { assetIds: string[] } }) => Promise<any>;
};

export type AssetCategoryRemoveMutationResponse = {
  assetCategoryRemove: (mutation: { variables: { _id: string } }) => Promise<any>;
};

export type DetailQueryResponse = {
  assetDetail: IAsset;
  loading: boolean;
};

export type CategoryDetailQueryResponse = {
  assetCategoryDetail: IAssetCategory;
  loading: boolean;
};

export type CountByTagsQueryResponse = {
  assetCountByTags: { [key: string]: number };
  loading: boolean;
};

export type MergeMutationVariables = {
  assetIds: string[];
  assetFields: IAsset;
};

export type MergeMutationResponse = {
  assetsMerge: (params: { variables: MergeMutationVariables }) => Promise<any>;
};

// UOM

export type UomAddMutationResponse = {
  uomsAdd: (mutation: { variables: MutationUomVariables }) => Promise<any>;
};

export type UomEditMutationResponse = {
  uomsEdit: (mutation: { variables: MutationUomVariables }) => Promise<any>;
};

export type UomRemoveMutationResponse = {
  uomsRemove: (mutation: { variables: { uomIds: string[] } }) => Promise<any>;
};

// SETTINGS

export type IConfigsMap = { [key: string]: any };

export type IAssetsConfig = {
  _id: string;
  code: string;
  value: any;
};

// query types
export type AssetsConfigsQueryResponse = {
  assetsConfigs: IAssetsConfig[];
  loading: boolean;
  refetch: () => void;
};
