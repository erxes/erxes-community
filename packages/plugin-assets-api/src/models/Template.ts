import { Model } from 'mongoose';
import { validSearchText } from 'erxes-api-utils';
import * as _ from 'underscore';
import { IModels } from '../connectionResolver';
import {
  IAssets,
  IAssetsDocument,
  IAssetsCategoryDocument,
  assetsSchema,
  IAssetsCategory,
  assetsCategorySchema
} from './definitions/assets';

export interface IAssetsModel extends Model<IAssetsDocument> {
  createAssets(doc: IAssets): Promise<IAssetsDocument>;
  editAssets(_id, doc): Promise<IAssetsDocument>;
  deleteAssets(assetIds: string[]): Promise<IAssetsDocument>;
  getAssets(_id: string): Promise<IAssetsDocument>;
}

export interface IAssetsCategoryModel extends Model<IAssetsCategoryDocument> {
  getAssetsCatogery(selector: any): Promise<IAssetsCategoryDocument>;
  createAssetsCategory(doc: IAssetsCategory): Promise<IAssetsCategoryDocument>;
  editAssetsCategory(_id, doc): Promise<IAssetsCategoryDocument>;
  deleteAssetsCategory(_id): Promise<IAssetsCategoryDocument>;
  generateOrder(
    parentCategory: any,
    doc: IAssetsCategory
  ): Promise<IAssetsCategoryDocument>;
}

export const loadAssetsClass = (models: IModels) => {
  class assets {
    /**
     * Create a car
     */
    public static async createAssets(doc) {
      // // Checking duplicated fields of car
      // await models.assets.checkDuplication(doc);

      const assets = await models.assets.create({
        ...doc,
        createdAt: new Date(),
        modifiedAt: new Date()
      });

      return assets;
    }

    /**
     * Update car
     */
    public static async editAssets(_id, doc) {
      // // Checking duplicated fields of car
      // await models.assets.checkDuplication(doc, [_id]);

      await models.assets.updateOne(
        { _id },
        { $set: { ...doc, modifiedAt: new Date() } }
      );

      return models.assets.findOne({ _id });
    }

    /**
     * Remove car
     */
    public static async deleteAssets(assetIds) {
      const a = await models.assets.deleteMany({ _id: { $in: assetIds } });

      return a;
    }

    public static async getAssets(_id: string) {
      const assets = await models.assets.findOne({ _id });

      if (!assets) {
        throw new Error('Car not found');
      }

      return assets;
    }
  }

  assetsSchema.loadClass(assets);

  return assetsSchema;
};

export const loadAssetsCategoryClass = (models: IModels) => {
  class assetsCategory {
    /**
     *
     * Get Assets Category
     */

    public static async getAssetsCatogery(selector: any) {
      const assetsCategory = await models.assetsCategory.findOne(selector);

      if (!assetsCategory) {
        throw new Error('Assets& service category not found');
      }

      return assetsCategory;
    }

    /**
     * Create a assets categorys
     */
    public static async createAssetsCategory(doc) {
      const parentCategory = doc.parentId
        ? await models.assetsCategory
            .findOne({
              _id: doc.parentId
            })
            .lean()
        : undefined;

      // Generatingg order
      doc.order = await this.generateOrder(parentCategory, doc);

      return models.assetsCategory.create(doc);
    }

    /**
     * Update Assets category
     */
    public static async editAssetsCategory(_id, doc) {
      const parentCategory = doc.parentId
        ? await models.assetsCategory
            .findOne({
              _id: doc.parentId
            })
            .lean()
        : undefined;
      if (parentCategory && parentCategory.parentId === _id) {
        throw new Error('Cannot change category');
      }

      // Generatingg  order
      doc.order = await this.generateOrder(parentCategory, doc);

      const assetsCategory = await models.assetsCategory.getAssetsCatogery({
        _id
      });

      const childCategories = await models.assetsCategory.find({
        $and: [
          { order: { $regex: new RegExp(assetsCategory.order, 'i') } },
          { _id: { $ne: _id } }
        ]
      });

      await models.assetsCategory.updateOne({ _id }, { $set: doc });

      // updating child categories order
      childCategories.forEach(async category => {
        let order = category.order;

        order = order.replace(assetsCategory.order, doc.order);

        await models.assetsCategory.updateOne(
          { _id: category._id },
          { $set: { order } }
        );
      });

      return models.assetsCategory.findOne({ _id });
    }

    /**
     * Remove Aseets category
     */
    public static async deleteAssetsCategory(_id: string) {
      await models.assetsCategory.getAssetsCatogery({ _id });

      let count = await models.assets.countDocuments({ categoryId: _id });
      count += await models.assetsCategory.countDocuments({
        parentId: _id
      });

      if (count > 0) {
        throw new Error("Can't remove a assets category");
      }

      return models.assetsCategory.deleteOne({ _id });
    }

    /**
     * Generating order
     */
    public static async generateOrder(parentCategory, doc) {
      const order = parentCategory
        ? `${parentCategory.order}/${doc.code}`
        : `${doc.code}`;

      return order;
    }
  }

  assetsCategorySchema.loadClass(assetsCategory);

  return assetsCategorySchema;
};
