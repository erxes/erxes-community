import { IContext } from '../../connectionResolver';
import { IAssetGroupDocument } from '../../common/types/asset';
import { ASSET_STATUSES } from '../../common/constant/asset';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.AssetGroup.findOne({ _id });
  },

  isRoot(group: IAssetGroupDocument, {}) {
    return group.parentId ? false : true;
  },

  async assetCount(group: IAssetGroupDocument, {}, { models }: IContext) {
    const asset_group_ids = await models.AssetGroup.find(
      { order: { $regex: new RegExp(group.order) } },
      { _id: 1 }
    );

    return models.Asset.countDocuments({
      groupId: { $in: asset_group_ids },
      status: { $ne: ASSET_STATUSES.DELETED }
    });
  }
};
