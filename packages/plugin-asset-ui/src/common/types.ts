import { ICompany } from '@erxes/ui-contacts/src/companies/types';
import { IAttachment, QueryResponse } from '@erxes/ui/src/types';
import React from 'react';

export type CommonFormGroupTypes = {
  children?: React.ReactChild;
  label: string;
  required?: boolean;
};

export type IAssetGroupTypes = {
  _id: string;
  name: string;
  order: string;
  code: string;
  parentId: string;
  description: string;
  status: string;
  attachment: IAttachment;
  isRoot: boolean;
  assetCount: number;
};

export type IAssetGroupQeuryResponse = {
  assetGroups: IAssetGroupTypes[];
  loading: boolean;
  refetch: () => void;
};

export type IAssetGroupsTotalCountResponse = {
  assetGroupsTotalCount: number;
} & QueryResponse;

export type IAssetQueryResponse = {
  assets: IAsset[];
  loading: boolean;
  refetch: (variables?: any) => void;
};

export type IMovementDetailQueryResponse = {
  assetMovement: IMovementType;
  loading: boolean;
  refetch: () => void;
};

export type IAssetTotalCountQueryResponse = {
  assetsCount: number;
  loading: boolean;
  refetch: () => void;
};
export type IAssetDetailQueryResponse = {
  assetDetail: IAsset;
  loading: boolean;
};
export interface IAssetGroup {
  _id: string;
  name: string;
  order: string;
  code: string;
  description?: string;
  attachment?: any;
  status: string;
  parentId?: string;
  createdAt: Date;
  assetCount: number;
  isRoot: boolean;
}

export interface IAsset {
  _id: string;
  name: string;
  type: string;
  groupId: string;
  parentId: string;
  description: string;
  sku: string;
  order: string;
  code: string;
  unitPrice: number;
  customFieldsData?: any;
  createdAt: Date;
  vendorId?: string;

  attachment?: any;
  attachmentMore?: any[];
  supply: string;
  assetCount: number;
  minimiumCount: number;
  group: IAssetGroup;
  parent: IAsset;
  chidlAssetCount: number;
  vendor?: ICompany;
}

export interface IAssetDoc {
  _id?: string;
  type: string;
  name?: string;
  description?: string;
  sku?: string;
  createdAt?: Date;
  customFieldsData?: any;
}

export type IAssetGroupDetailQueryResponse = {
  assetGroupDetail: IAssetGroup;
  loading: boolean;
};

export type MutationVariables = {
  _id?: string;
  type: string;
  name?: string;
  description?: string;
  sku?: string;
  createdAt?: Date;
};

export type AssetRemoveMutationResponse = {
  assetsRemove: (mutation: { variables: { assetIds: string[] } }) => Promise<any>;
};

export type AssetEditMutationResponse = {
  editMutation: (mutation: { variables: MutationVariables }) => Promise<any>;
};

export type MergeMutationVariables = {
  assetIds: string[];
  assetFields: IAsset;
};

export type MergeMutationResponse = {
  assetsMerge: (params: { variables: MergeMutationVariables }) => Promise<any>;
};

export type SelectedVariables = {
  assetId?: string;
  assetName?: string;
  departmentIds?: string[];
  branchIds?: string[];
  currentMovement?: object;
};

export type IMovementType = {
  _id?: string;
  assetIds?: string[];
  assets?: IMovementItem[];
  createdAt?: string;
};

export type IMovementItem = {
  _id: string;
  assetId: string;
  assetName: string;
  userType: string;
  branchId?: string;
  departmentId?: string;
  teamMemberId?: string;
  customerId?: string;
  companyId?: string;
  branch?: any;
  department?: any;
  company?: any;
  customer?: any;
  teamMember?: any;
  createdAt?: string;
};

export type MovementItemsQueryResponse = {
  assetMovementAssets: IMovementItem[];
} & QueryResponse;

export type MovementItemsTotalCountQueryResponse = {
  assetMovementItemsTotalCount: number;
};

export type MovementQueryResponse = {
  assetMovements: IMovementType[];
  loading: boolean;
  refetch: () => void;
};

export type MovementsTotalCountQueryResponse = {
  assetMovementTotalCount: number;
} & QueryResponse;
