import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';
import { assetGroupSchema } from './definitions/asset';

import { IAssetGroup, IAssetGroupDocument } from '../common/types/asset';
import { ASSET_STATUSES } from '../common/constant/asset';
export interface IAssetGroupModel extends Model<IAssetGroupDocument> {
  assetGroupAdd(doc: IAssetGroup): Promise<IAssetGroupDocument>;
  getAssetGroup(selector: any): Promise<IAssetGroupDocument>;
  updateAssetGroup(_id: string, doc: IAssetGroup): Promise<IAssetGroupDocument>;
  assetGroupRemove(_id: string): void;
}

export const loadAssetGroupClass = (models: IModels) => {
  class AssetGroup {
    public static async getAssetGroup(selector: any) {
      const assetGroups = await models.AssetGroup.findOne(selector);

      if (!assetGroups) {
        throw new Error('Asset Group not found');
      }

      return assetGroups;
    }

    public static async assetGroupAdd(doc: IAssetGroup) {
      await this.checkCodeDuplication(doc.code);

      const parentGroup = await models.AssetGroup.findOne({
        _id: doc.parentId
      }).lean();

      // Generatingg order
      doc.order = await this.generateOrder(parentGroup, doc);

      return models.AssetGroup.create(doc);
    }

    public static async updateAssetGroup(_id: string, doc: IAssetGroup) {
      const group = await models.AssetGroup.getAssetGroup({
        _id
      });

      if (group.code !== doc.code) {
        await this.checkCodeDuplication(doc.code);
      }

      const parentGroup = await models.AssetGroup.findOne({
        _id: doc.parentId
      }).lean();

      if (parentGroup && parentGroup.parentId === _id) {
        throw new Error('Cannot change group');
      }

      // Generatingg  order
      doc.order = await this.generateOrder(parentGroup, doc);

      const assetGroups = await models.AssetGroup.getAssetGroup({
        _id
      });

      const childCategories = await models.AssetGroup.find({
        $and: [{ order: { $regex: new RegExp(assetGroups.order, 'i') } }, { _id: { $ne: _id } }]
      });

      await models.AssetGroup.updateOne({ _id }, { $set: doc });

      // updating child categories order
      childCategories.forEach(async childGroup => {
        let order = childGroup.order;

        order = order.replace(assetGroups.order, doc.order);

        await models.AssetGroup.updateOne({ _id: childGroup._id }, { $set: { order } });
      });

      return models.AssetGroup.findOne({ _id });
    }

    public static async assetGroupRemove(_id: string) {
      await models.AssetGroup.getAssetGroup({ _id });

      let count = await models.Asset.countDocuments({
        groupId: _id,
        status: { $ne: ASSET_STATUSES.DELETED }
      });
      count += await models.AssetGroup.countDocuments({ parentId: _id });

      if (count > 0) {
        throw new Error("Can't remove a asset group");
      }

      return models.AssetGroup.deleteOne({ _id });
    }

    static async checkCodeDuplication(code: string) {
      if (code.includes('/')) {
        throw new Error('The "/" character is not allowed in the code');
      }

      const group = await models.AssetGroup.findOne({
        code
      });

      if (group) {
        throw new Error('Code must be unique');
      }
    }
    public static async generateOrder(parentGroup: IAssetGroup, doc: IAssetGroup) {
      const order = parentGroup ? `${parentGroup.order}/${doc.code}` : `${doc.code}`;

      return order;
    }
  }

  assetGroupSchema.loadClass(AssetGroup);

  return assetGroupSchema;
};
