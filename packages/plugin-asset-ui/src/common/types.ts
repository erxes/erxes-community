import { ICompany } from '@erxes/ui-contacts/src/companies/types';
import { ITag } from '@erxes/ui-tags/src/types';
import { IAttachment } from '@erxes/ui/src/types';
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

export type IAssetGroupQuery = {
  list: [IAssetGroupTypes];
  totalCount: number;
};

export type IAssetGroupQeuryResponse = {
  assetGroup: IAssetGroupQuery;
  loading: boolean;
  refetch: () => void;
};

export type IAssetQueryResponse = {
  assets: IAsset[];
  loading: boolean;
  refetch: () => void;
};

export type IAssetTotalCountQueryResponse = {
  assetsCount: number;
  loading: boolean;
  refetch: () => void;
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
  description: string;
  getTags?: ITag[];
  sku: string;
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

export type AssetRemoveMutationResponse = {
  assetsRemove: (mutation: { variables: { assetIds: string[] } }) => Promise<any>;
};
export type MergeMutationVariables = {
  assetIds: string[];
  assetFields: IAsset;
};

export type MergeMutationResponse = {
  assetsMerge: (params: { variables: MergeMutationVariables }) => Promise<any>;
};
