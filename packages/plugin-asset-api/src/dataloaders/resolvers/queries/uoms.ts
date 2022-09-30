import { IContext } from '../../../connectionResolver';

const uomQueries = {
  /**
   * Uoms list
   */
  uoms(_root, _args, { models }: IContext) {
    return models.Uoms.find({})
      .sort({ order: 1 })
      .lean();
  },

  /**
   * Get all uoms count. We will use it in pager
   */
  uomsTotalCount(_root, _args, { models }: IContext) {
    return models.Uoms.find({}).countDocuments();
  }
};

// requireLogin(assetQueries, 'assetsTotalCount');
// checkPermission(assetQueries, 'assets', 'showAssets', []);
// checkPermission(assetQueries, 'assetCategories', 'showAssets', []);
// checkPermission(assetQueries, 'assetCountByTags', 'showAssets', []);

export default uomQueries;
