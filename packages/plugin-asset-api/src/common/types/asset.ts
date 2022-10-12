import { ICustomField } from '@erxes/api-utils/src/types';
import { Document } from 'mongoose';

export interface IAsset {
  name: string;
  parentId?: string;
  groupId?: string;
  groupCode?: string;
  type?: string;
  description?: string;
  sku?: string;
  unitPrice?: number;
  order: string;
  code: string;
  customFieldsData?: ICustomField[];
  assetId?: string;
  attachment?: any;
  attachmentMore?: any[];
  status?: string;
  supply?: string;
  assetCount?: number;
  minimiumCount?: number;
  vendorId?: string;
  vendorCode?: string;

  mergedIds?: string[];

  currentMovement?: {
    branchId: string;
    departmentId: string;
    teamMemberId: string;
    customerId: string;
    companyId: string;
  };
}

export interface IAssetDocument extends IAsset, Document {
  _id: string;
  createdAt: Date;
}

export interface IAssetGroup {
  name: string;
  code: string;
  order: string;
  description?: string;
  parentId?: string;
  attachment?: any;
  status?: string;
}
export interface IAssetGroupDocument extends IAssetGroup, Document {
  _id: string;
  createdAt: Date;
}

export interface IMovement {
  assetIds: string[];
  userId: string;
  createdAt: Date;
  movedAt: Date;
}
export interface IMovementAsset {
  assetId: string;
  assetName: string;
  userType: string;
  branchId: string;
  customerId: string;
  departmentId: string;
  teamMemberId: string;
  companyId: string;
}

export interface IMovementDocument extends IMovement, Document {
  _id: string;
  createdAt: Date;
}

export interface IMovementAssetDocument extends IMovementAsset, Document {
  _id: string;
  createdAt: Date;
}
