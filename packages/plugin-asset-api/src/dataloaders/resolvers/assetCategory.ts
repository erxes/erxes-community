import { IContext } from '../../connectionResolver';
import { IAssetCategoryDocument, ASSET_STATUSES } from '../../models/definitions/assets';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.AssetCategories.findOne({ _id });
  },

  isRoot(category: IAssetCategoryDocument, {}) {
    return category.parentId ? false : true;
  },

  async assetCount(category: IAssetCategoryDocument, {}, { models }: IContext) {
    const asset_category_ids = await models.AssetCategories.find(
      { order: { $regex: new RegExp(category.order) } },
      { _id: 1 }
    );
    return models.Assets.countDocuments({
      categoryId: { $in: asset_category_ids },
      status: { $ne: ASSET_STATUSES.DELETED }
    });
  }
};
