import {
  lastvieweditemSchema,
  ILastViewedItem,
  ILastViewedItemDocument
} from './definitions/lastViewedItem';
import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';

export interface ILastViewedItemModel extends Model<ILastViewedItemDocument> {
  getLastViewedItemById(_id: string): Promise<ILastViewedItemDocument>;
  getLastViewedItem(productId: string): Promise<ILastViewedItemDocument>;
  getLastViewedItems(customerId: string): Promise<ILastViewedItemDocument>;
  lastViewedItemAdd(doc: ILastViewedItem): Promise<ILastViewedItemDocument>;
  updateLastViewedItem(
    _id: string,
    doc: ILastViewedItem
  ): Promise<ILastViewedItemDocument>;
  removeLastViewedItem(_id: string): Promise<ILastViewedItemDocument>;
}

export const loadLastViewedItemClass = (models: IModels, subdomain: string) => {
  class LastViewedItem {
    public static async getLastViewedItem(productId: string) {
      return models.LastViewedItem.findOne({ productId }).lean();
    }
    public static async getLastViewedItems(customerId: string) {
      return models.LastViewedItem.find({ customerId })
        .sort({ modifiedAt: 1 })
        .lean();
    }
    public static async lastViewedItemAdd(doc: ILastViewedItem) {
      const current = await models.LastViewedItem.getLastViewedItem(
        doc.productId
      );
      if (current) {
        await models.LastViewedItem.updateOne(
          { _id: current._id },
          { $set: { ...doc, modifiedAt: new Date() } }
        );
        return models.LastViewedItem.findOne({ _id: current._id });
      }
      const item = await models.LastViewedItem.create({
        ...doc,
        createdAt: new Date(),
        modifiedAt: new Date()
      });
      return item;
    }
    public static async removeLastViewedItem(_id: string) {
      return models.LastViewedItem.findOneAndRemove({ _id });
    }
  }
  lastvieweditemSchema.loadClass(LastViewedItem);
  return lastvieweditemSchema;
};
