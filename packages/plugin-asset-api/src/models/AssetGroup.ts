import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';
import { assetGroupSchema, ASSET_STATUSES, IAssetGroup, IAssetGroupDocument } from './definitions/asset';
export interface IAssetGroupModel extends Model<IAssetGroupDocument> {
  assetGroupAdd(doc: IAssetGroup): Promise<IAssetGroupDocument>;
  getAssetGroup(selector: any): Promise<IAssetGroupDocument>;
  updateAssetGroup(_id: string, doc: IAssetGroup): Promise<IAssetGroupDocument>;
  assetGroupRemove(_id: string): void;
}

export const loadAssetGroupClass = (models: IModels) => {
  class AssetGroup {
    public static async getAssetGroup(selector: any) {
      const productCategory = await models.AssetGroup.findOne(selector);

      if (!productCategory) {
        throw new Error('Product & service category not found');
      }

      return productCategory;
    }

    public static async assetGroupAdd(doc: IAssetGroup) {
      await this.checkCodeDuplication(doc.code);

      const parentCategory = await models.AssetGroup.findOne({
        _id: doc.parentId
      }).lean();

      // Generatingg order
      doc.order = await this.generateOrder(parentCategory, doc);

      return models.AssetGroup.create(doc);
    }

    public static async updateAssetGroup(_id: string, doc: IAssetGroup) {
      const category = await models.AssetGroup.getAssetGroup({
        _id
      });

      if (category.code !== doc.code) {
        await this.checkCodeDuplication(doc.code);
      }

      const parentCategory = await models.AssetGroup.findOne({
        _id: doc.parentId
      }).lean();

      if (parentCategory && parentCategory.parentId === _id) {
        throw new Error('Cannot change category');
      }

      // Generatingg  order
      doc.order = await this.generateOrder(parentCategory, doc);

      const productCategory = await models.AssetGroup.getAssetGroup({
        _id
      });

      const childCategories = await models.AssetGroup.find({
        $and: [{ order: { $regex: new RegExp(productCategory.order, 'i') } }, { _id: { $ne: _id } }]
      });

      await models.AssetGroup.updateOne({ _id }, { $set: doc });

      // updating child categories order
      childCategories.forEach(async childCategory => {
        let order = childCategory.order;

        order = order.replace(productCategory.order, doc.order);

        await models.AssetGroup.updateOne({ _id: childCategory._id }, { $set: { order } });
      });

      return models.AssetGroup.findOne({ _id });
    }

    public static async assetGroupRemove(_id: string) {
      await models.AssetGroup.getAssetGroup({ _id });

      let count = await models.Asset.countDocuments({
        categoryId: _id,
        status: { $ne: ASSET_STATUSES.DELETED }
      });
      count += await models.AssetGroup.countDocuments({ parentId: _id });

      if (count > 0) {
        throw new Error("Can't remove a product category");
      }

      return models.AssetGroup.deleteOne({ _id });
    }

    static async checkCodeDuplication(code: string) {
      if (code.includes('/')) {
        throw new Error('The "/" character is not allowed in the code');
      }

      const category = await models.AssetGroup.findOne({
        code
      });

      if (category) {
        throw new Error('Code must be unique');
      }
    }
    public static async generateOrder(parentCategory: IAssetGroup, doc: IAssetGroup) {
      const order = parentCategory ? `${parentCategory.order}/${doc.code}` : `${doc.code}`;

      return order;
    }
  }

  assetGroupSchema.loadClass(AssetGroup);

  return assetGroupSchema;
};
