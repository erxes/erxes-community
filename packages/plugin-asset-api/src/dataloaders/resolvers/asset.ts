import { IContext } from '../../connectionResolver';
import { IAssetDocument } from '../../common/types/asset';
import { ASSET_STATUSES } from '../../common/constant/asset';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.Asset.findOne({ _id });
  },

  group(asset: IAssetDocument, _, { dataLoaders }: IContext) {
    return (asset.groupId && dataLoaders.assetGroup.load(asset.groupId)) || null;
  },

  parent(asset: IAssetDocument, _, { dataLoaders }: IContext) {
    return (asset.parentId && dataLoaders.asset.load(asset.parentId)) || null;
  },

  isRoot(asset: IAssetDocument, {}) {
    return asset.parentId ? false : true;
  },

  async chidlAssetCount(asset: IAssetDocument, {}, { models }: IContext) {
    const asset_ids = await models.Asset.find(
      { order: { $regex: new RegExp(asset.order) } },
      { _id: 1 }
    );

    return models.Asset.countDocuments({
      parentId: { $in: asset_ids },
      status: { $ne: ASSET_STATUSES.DELETED }
    });
  },

  vendor(asset: IAssetDocument, _, { dataLoaders }: IContext) {
    return (asset.vendorId && dataLoaders.company.load(asset.vendorId)) || null;
  }
};
