import { ICustomField, IUserDocument } from '@erxes/api-utils/src/types';
import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';
import { sendCardsMessage, sendContactsMessage, sendFormsMessage } from '../messageBroker';
import {
  IAsset,
  IAssetCategory,
  IAssetCategoryDocument,
  IAssetDocument,
  assetCategorySchema,
  assetSchema,
  ASSET_STATUSES
} from './definitions/assets';

export interface IAssetModel extends Model<IAssetDocument> {
  getAsset(selector: any): Promise<IAssetDocument>;
  createAsset(doc: IAsset): Promise<IAssetDocument>;
  updateAsset(_id: string, doc: IAsset): Promise<IAssetDocument>;
  removeAssets(_ids: string[]): Promise<{ n: number; ok: number }>;
  mergeAssets(assetIds: string[], assetFields: IAsset): Promise<IAssetDocument>;
}

export const loadAssetClass = (models: IModels, subdomain: string) => {
  class Asset {
    /**
     *
     * Get Asset Cagegory
     */

    public static async getAsset(selector: any) {
      const asset = await models.Assets.findOne(selector);

      if (!asset) {
        throw new Error('Asset not found');
      }

      return asset;
    }

    static async checkCodeDuplication(code: string) {
      const asset = await models.Assets.findOne({
        code,
        status: { $ne: ASSET_STATUSES.DELETED }
      });

      if (asset) {
        throw new Error('Code must be unique');
      }
    }

    /**
     * Create a asset
     */
    public static async createAsset(doc: IAsset) {
      await this.checkCodeDuplication(doc.code);

      if (doc.categoryCode) {
        const category = await models.AssetCategories.getAssetCatogery({
          code: doc.categoryCode
        });
        doc.categoryId = category._id;
      }

      if (doc.vendorCode) {
        const vendor = await sendContactsMessage({
          subdomain,
          action: 'companies.findOne',
          data: {
            $or: [
              { code: doc.vendorCode },
              { primaryEmail: doc.vendorCode },
              { primaryPhone: doc.vendorCode },
              { primaryName: doc.vendorCode }
            ]
          },
          isRPC: true
        });

        doc.vendorId = vendor?._id;
      }

      doc.customFieldsData = await sendFormsMessage({
        subdomain,
        action: 'fields.prepareCustomFieldsData',
        data: doc.customFieldsData,
        isRPC: true
      });

      return models.Assets.create(doc);
    }

    /**
     * Update Asset
     */
    public static async updateAsset(_id: string, doc: IAsset) {
      const asset = await models.Assets.getAsset({ _id });

      if (asset.code !== doc.code) {
        await this.checkCodeDuplication(doc.code);
      }

      if (doc.customFieldsData) {
        // clean custom field values
        doc.customFieldsData = await sendFormsMessage({
          subdomain,
          action: 'fields.prepareCustomFieldsData',
          data: doc.customFieldsData,
          isRPC: true
        });
      }

      await models.Assets.updateOne({ _id }, { $set: doc });

      return models.Assets.findOne({ _id });
    }

    /**
     * Remove assets
     */
    public static async removeAssets(_ids: string[]) {
      const dealAssetIds = await sendCardsMessage({
        subdomain,
        action: 'findDealAssetIds',
        data: {
          _ids
        },
        isRPC: true,
        defaultValue: []
      });

      const usedIds: string[] = [];
      const unUsedIds: string[] = [];
      let response = 'deleted';

      for (const id of _ids) {
        if (!dealAssetIds.includes(id)) {
          unUsedIds.push(id);
        } else {
          usedIds.push(id);
        }
      }

      if (usedIds.length > 0) {
        await models.Assets.updateMany(
          { _id: { $in: usedIds } },
          {
            $set: { status: ASSET_STATUSES.DELETED }
          }
        );
        response = 'updated';
      }

      await models.Assets.deleteMany({ _id: { $in: unUsedIds } });

      return response;
    }

    /**
     * Merge assets
     */

    public static async mergeAssets(assetIds: string[], assetFields: IAsset) {
      const fields = ['name', 'code', 'unitPrice', 'categoryId', 'type'];

      for (const field of fields) {
        if (!assetFields[field]) {
          throw new Error(`Can not merge assets. Must choose ${field} field.`);
        }
      }

      let customFieldsData: ICustomField[] = [];
      let tagIds: string[] = [];
      const name: string = assetFields.name || '';
      const type: string = assetFields.type || '';
      const description: string = assetFields.description || '';
      const categoryId: string = assetFields.categoryId || '';
      const vendorId: string = assetFields.vendorId || '';
      const usedIds: string[] = [];

      for (const assetId of assetIds) {
        const assetObj = await models.Assets.getAsset({ _id: assetId });

        const assetTags = assetObj.tagIds || [];

        // merge custom fields data
        customFieldsData = [...customFieldsData, ...(assetObj.customFieldsData || [])];

        // Merging assets tagIds
        tagIds = tagIds.concat(assetTags);

        await models.Assets.findByIdAndUpdate(assetId, {
          $set: {
            status: ASSET_STATUSES.DELETED,
            code: Math.random()
              .toString()
              .concat('^', assetObj.code)
          }
        });
      }

      // Removing Duplicates
      tagIds = Array.from(new Set(tagIds));

      // Creating asset with properties
      const asset = await models.Assets.createAsset({
        ...assetFields,
        customFieldsData,
        tagIds,
        mergedIds: assetIds,
        name,
        type,
        description,
        categoryId,
        vendorId
      });

      const dealAssetIds = await sendCardsMessage({
        subdomain,
        action: 'findDealAssetIds',
        data: {
          _ids: assetIds
        },
        isRPC: true
      });

      for (const deal of dealAssetIds) {
        if (assetIds.includes(deal)) {
          usedIds.push(deal);
        }
      }

      await sendCardsMessage({
        subdomain,
        action: 'deals.updateMany',
        data: {
          selector: {
            'assetsData.assetId': { $in: usedIds }
          },
          modifier: {
            $set: { 'assetsData.$.assetId': asset._id }
          }
        },
        isRPC: true
      });

      return asset;
    }
  }

  assetSchema.loadClass(Asset);

  return assetSchema;
};

export interface IAssetCategoryModel extends Model<IAssetCategoryDocument> {
  getAssetCatogery(selector: any): Promise<IAssetCategoryDocument>;
  createAssetCategory(doc: IAssetCategory): Promise<IAssetCategoryDocument>;
  updateAssetCategory(_id: string, doc: IAssetCategory): Promise<IAssetCategoryDocument>;
  removeAssetCategory(_id: string): void;
}

export const loadAssetCategoryClass = (models: IModels) => {
  class AssetCategory {
    /**
     *
     * Get Asset Cagegory
     */

    public static async getAssetCatogery(selector: any) {
      const assetCategory = await models.AssetCategories.findOne(selector);

      if (!assetCategory) {
        throw new Error('Asset & service category not found');
      }

      return assetCategory;
    }

    static async checkCodeDuplication(code: string) {
      if (code.includes('/')) {
        throw new Error('The "/" character is not allowed in the code');
      }

      const category = await models.AssetCategories.findOne({
        code
      });

      if (category) {
        throw new Error('Code must be unique');
      }
    }

    /**
     * Create a asset categorys
     */
    public static async createAssetCategory(doc: IAssetCategory) {
      await this.checkCodeDuplication(doc.code);

      const parentCategory = await models.AssetCategories.findOne({
        _id: doc.parentId
      }).lean();

      // Generatingg order
      doc.order = await this.generateOrder(parentCategory, doc);

      return models.AssetCategories.create(doc);
    }

    /**
     * Update Asset category
     */
    public static async updateAssetCategory(_id: string, doc: IAssetCategory) {
      const category = await models.AssetCategories.getAssetCatogery({
        _id
      });

      if (category.code !== doc.code) {
        await this.checkCodeDuplication(doc.code);
      }

      const parentCategory = await models.AssetCategories.findOne({
        _id: doc.parentId
      }).lean();

      if (parentCategory && parentCategory.parentId === _id) {
        throw new Error('Cannot change category');
      }

      // Generatingg  order
      doc.order = await this.generateOrder(parentCategory, doc);

      const assetCategory = await models.AssetCategories.getAssetCatogery({
        _id
      });

      const childCategories = await models.AssetCategories.find({
        $and: [{ order: { $regex: new RegExp(assetCategory.order, 'i') } }, { _id: { $ne: _id } }]
      });

      await models.AssetCategories.updateOne({ _id }, { $set: doc });

      // updating child categories order
      childCategories.forEach(async childCategory => {
        let order = childCategory.order;

        order = order.replace(assetCategory.order, doc.order);

        await models.AssetCategories.updateOne({ _id: childCategory._id }, { $set: { order } });
      });

      return models.AssetCategories.findOne({ _id });
    }

    /**
     * Remove Asset category
     */
    public static async removeAssetCategory(_id: string) {
      await models.AssetCategories.getAssetCatogery({ _id });

      let count = await models.Assets.countDocuments({
        categoryId: _id,
        status: { $ne: ASSET_STATUSES.DELETED }
      });
      count += await models.AssetCategories.countDocuments({ parentId: _id });

      if (count > 0) {
        throw new Error("Can't remove a asset category");
      }

      return models.AssetCategories.deleteOne({ _id });
    }

    /**
     * Generating order
     */
    public static async generateOrder(parentCategory: IAssetCategory, doc: IAssetCategory) {
      const order = parentCategory ? `${parentCategory.order}/${doc.code}` : `${doc.code}`;

      return order;
    }
  }

  assetCategorySchema.loadClass(AssetCategory);

  return assetCategorySchema;
};
