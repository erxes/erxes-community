import { ICustomField } from '@erxes/api-utils/src/types';
import { Document } from 'mongoose';

export interface IAsset {
  name: string;
  groupId?: string;
  groupCode?: string;
  type?: string;
  description?: string;
  sku?: string;
  unitPrice?: number;
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
