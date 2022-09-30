import { queries as assetQueries } from '@erxes/ui-assets/src/graphql';

const assetFields = assetQueries.assetFields;

const assetCategories = assetQueries.assetCategories;

const assets = assetQueries.assets;

const assetsCount = `
  query assetsTotalCount($type: String) {
    assetsTotalCount(type: $type)
  }
`;

const assetCountByTags = `
  query assetCountByTags {
    assetCountByTags
  }
`;

const assetCategoriesCount = `
  query assetCategoriesTotalCount {
    assetCategoriesTotalCount
  }
`;

const assetDetail = assetQueries.assetDetail;

const assetCategoryDetail = `
  query assetCategoryDetail($_id: String) {
    assetCategoryDetail(_id: $_id) {
      _id
      name
      assetCount
    }
  }
`;

// UOM

const uoms = assetQueries.uoms;

const uomsTotalCount = assetQueries.uomsTotalCount;

// Settings

const assetsConfigs = assetQueries.assetsConfigs;

export default {
  assets,
  assetDetail,
  assetCountByTags,
  assetsCount,
  assetCategories,
  assetCategoriesCount,
  assetCategoryDetail,

  uoms,
  uomsTotalCount,

  assetsConfigs
};
