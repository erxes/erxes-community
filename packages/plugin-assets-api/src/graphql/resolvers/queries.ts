import { requireLogin } from '@erxes/api-utils/src/permissions';
import { IContext } from '../../connectionResolver';

const assetsQueries = {
  assetsCategories: async (
    _root,
    { parentId, searchValue },
    { commonQuerySelector, models }
  ) => {
    const filter: any = commonQuerySelector;

    if (parentId) {
      filter.parentId = parentId;
    }

    if (searchValue) {
      filter.name = new RegExp(`.*${searchValue}.*`, 'i');
    }

    return models.assetsCategory.find(filter).sort({ order: 1 });
  },

  assets: async (_root, _param, { models }) => {
    // const filter: any = commonQuerySelector;

    // if (parentId) {
    //   filter.parentId = parentId;
    // }

    // if (searchValue) {
    //   filter.name = new RegExp(`.*${searchValue}.*`, "i");
    // }

    return models.assets.find();
  },

  assetsCategoriesTotalCount: async (_root, _param, { models }: IContext) => {
    return models.assetsCategory.find().countDocuments();
  },

  assetsTotalCount: async (_root, _param, { models }: IContext) => {
    return models.assets.find().countDocuments();
  },

  assetsDetail: async (_root, { _id }, { models }) => {
    return models.assets.getAssets({ _id });
  }
};

// requireLogin(assetsQueries, 'assets');
// requireLogin(assetsQueries, 'assetsTotalCount');

export default assetsQueries;
