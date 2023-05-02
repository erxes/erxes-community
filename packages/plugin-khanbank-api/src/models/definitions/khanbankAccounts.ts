import { field } from '@erxes/api-utils/src/definitions/utils';
import { Document, Schema } from 'mongoose';

export interface IKhanbankAccountConfig {
  accountNumber: string;
  pollingInterval: number;
  notifyUsers: string[];
  lastRecord: number;
  isDefault: boolean;
  isActive: boolean;
  configId: string;
}

export interface IKhanbankAccountConfigDocument
  extends IKhanbankAccountConfig,
    Document {
  _id: string;
  lastSyncedAt: Date;
}

export const khanbankAccountConfigSchema = new Schema({
  _id: field({ pkey: true }),
  accountNumber: field({ type: String }),
  pollingInterval: field({ type: Number, enum: [1, 2, 3, 5, 10, 20] }),
  notifyUsers: field({ type: [String] }),
  lastRecord: field({ type: Number }),
  isDefault: field({ type: Boolean }),
  lastSyncedAt: field({ type: Date }),
  isActive: field({ type: Boolean, default: false }),
  configId: field({ type: String, required: true })
});
