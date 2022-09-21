import { IContext } from '../../connectionResolver';
import { IAssetsCategoryDocument } from '../../models/definitions/assets';

const AssetsCategory = {
  __resolveReference({ _id }, { models }: IContext) {
    return models.assetsCategory.findOne({ _id });
  },

  isRoot(category: IAssetsCategoryDocument, {}) {
    return category.parentId ? false : true;
  }

  // async assetsCount(category: IAssetsCategoryDocument, {}, { models }: IContext) {
  //   const product_category_ids = await models.assetsCategory.find(
  //     { order: { $regex: new RegExp(category.order) } },
  //     { _id: 1 }
  //   );

  //   return models.assets.countDocuments({
  //     categoryId: { $in:                                                           },
  //     status: { $ne: 'Deleted' }
  //   });
  // }
};

export default AssetsCategory;
