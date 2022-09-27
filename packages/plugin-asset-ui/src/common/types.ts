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

export type IAssetGroup = {
  list: [IAssetGroupTypes];
  totalCount: number;
};

export type IAssetGroupQeuryResponse = {
  assetGroup: IAssetGroup;
  loading: boolean;
  refetch: () => void;
};
