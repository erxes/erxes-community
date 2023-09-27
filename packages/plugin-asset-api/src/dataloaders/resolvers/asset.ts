import { IContext } from '../../connectionResolver';
import { IAssetDocument } from '../../models/definitions/assets';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.Assets.findOne({ _id });
  },

  category(asset: IAssetDocument, _, { dataLoaders }: IContext) {
    return (asset.categoryId && dataLoaders.assetCategory.load(asset.categoryId)) || null;
  },

  async getTags(asset: IAssetDocument, _, { dataLoaders }: IContext) {
    const tags = await dataLoaders.tag.loadMany(asset.tagIds || []);
    return tags.filter(tag => tag);
  },

  vendor(asset: IAssetDocument, _, { dataLoaders }: IContext) {
    return (asset.vendorId && dataLoaders.company.load(asset.vendorId)) || null;
  },

  async uom(asset: IAssetDocument, _, { dataLoaders, models }: IContext) {
    if (!(await models.AssetsConfigs.getConfig('isReqiureUOM', ''))) {
      return null;
    }

    let uomId = asset.uomId;
    if (!uomId) {
      uomId = await models.AssetsConfigs.getConfig('default_uom', '');
    }

    if (!uomId) {
      return null;
    }

    return await models.Uoms.findOne({ _id: uomId });
  }
};
