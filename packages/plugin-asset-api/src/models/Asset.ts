import { Model } from 'mongoose';
import { IAsset, IAssetDocument } from '../common/types/asset';
import { IModels } from '../connectionResolver';
import { assetSchema } from './definitions/asset';
import { checkCodeDuplication } from '../utils';
import { sendCardsMessage, sendContactsMessage, sendFormsMessage } from '../messageBroker';
import { ASSET_STATUSES } from '../common/constant/asset';
import { ICustomField } from '@erxes/api-utils/src/types';
export interface IAssetModel extends Model<IAssetDocument> {
  getAssets(selector: any): Promise<IAssetDocument>;
  createAsset(doc: IAsset): Promise<IAssetDocument>;
  updateAsset(_id: string, doc: IAsset): Promise<IAssetDocument>;
  removeAssets(_ids: string[]): Promise<{ n: number; ok: number }>;
  mergeAssets(assetIds: string[], assetFields: IAsset): Promise<IAssetDocument>;
}

export const loadAssetClass = (models: IModels, subdomain: string) => {
  class Asset {
    public static async getAssets(selector: any) {
      const asset = await models.Asset.findOne(selector);

      if (!asset) {
        throw new Error('Asset not found');
      }

      return asset;
    }
    public static async createAsset(doc: IAsset) {
      await checkCodeDuplication(models, doc.code);

      const parentAsset = await models.Asset.findOne({ _id: doc.parentId }).lean();

      doc.order = await this.generateOrder(parentAsset, doc);

      if (doc.groupCode) {
        const group = await models.AssetGroup.getAssetGroup({
          code: doc.groupCode
        });
        doc.groupId = group._id;
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

      return models.Asset.create(doc);
    }
    public static async updateAsset(_id: string, doc: IAsset) {
      const asset = await models.Asset.getAssets({ _id });

      if (asset.code !== doc.code) {
        await checkCodeDuplication(models, doc.code);
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

      await models.Asset.updateOne({ _id }, { $set: doc });

      return models.Asset.findOne({ _id });
    }
    public static async removeAssets(_ids: string[]) {
      // const dealAssetIds = await sendCardsMessage({
      //   subdomain,
      //   action: 'findDealAssetIds',
      //   data: {
      //     _ids
      //   },
      //   isRPC: true,
      //   defaultValue: []
      // });
      const dealAssetIds: string[] = [];

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
        await models.Asset.updateMany(
          { _id: { $in: usedIds } },
          {
            $set: { status: ASSET_STATUSES.DELETED }
          }
        );
        response = 'updated';
      }

      const assets = await models.Asset.find({ _id: { $in: unUsedIds } });
      const orders = assets.map(asset => new RegExp(asset.order));

      const child_assets = await models.Asset.find({ order: { $in: orders } });

      const child_assets_ids = child_assets.map(asset => asset._id);

      await models.Asset.deleteMany({ _id: { $in: child_assets_ids } });

      return response;
    }

    public static async mergeAssets(assetIds: string[], assetFields: IAsset) {
      const fields = ['name', 'code', 'unitPrice', 'groupId', 'type'];

      for (const field of fields) {
        if (!assetFields[field]) {
          throw new Error(`Can not merge assets. Must choose ${field} field.`);
        }
      }

      let customFieldsData: ICustomField[] = [];
      const name: string = assetFields.name || '';
      const type: string = assetFields.type || '';
      const description: string = assetFields.description || '';
      const groupId: string = assetFields.groupId || '';
      const vendorId: string = assetFields.vendorId || '';
      const usedIds: string[] = [];

      for (const assetId of assetIds) {
        const assetObj = await models.Asset.getAssets({ _id: assetId });

        // merge custom fields data
        customFieldsData = [...customFieldsData, ...(assetObj.customFieldsData || [])];

        await models.Asset.findByIdAndUpdate(assetId, {
          $set: {
            status: ASSET_STATUSES.DELETED,
            code: Math.random()
              .toString()
              .concat('^', assetObj.code)
          }
        });
      }

      // Creating asset with properties
      const asset = await models.Asset.createAsset({
        ...assetFields,
        customFieldsData,
        mergedIds: assetIds,
        name,
        type,
        description,
        groupId,
        vendorId
      });

      const dealProductIds = await sendCardsMessage({
        subdomain,
        action: 'findDealProductIds',
        data: {
          _ids: assetIds
        },
        isRPC: true
      });

      for (const deal of dealProductIds) {
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
    public static async generateOrder(parentAsset: IAsset, doc: IAsset) {
      const order = parentAsset ? `${parentAsset.order}/${doc.code}` : `${doc.code}`;

      return order;
    }
  }
  assetSchema.loadClass(Asset);
  return assetSchema;
};
