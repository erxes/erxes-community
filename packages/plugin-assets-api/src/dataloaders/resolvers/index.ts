import customScalars from '@erxes/api-utils/src/customScalars';
import Asset from './asset';
import AssetCategories from './assetCategories';
import MovementAsset from './movementAsset';
import Movement from './movement';

import {
  AssetCategories as assetCategoriesMutations,
  Asset as assetMutations,
  Movement as movementMutations
} from './mutations';
import {
  AssetCategories as assetCategoriesQueries,
  Asset as assetQueries,
  Movement as movementQueries,
  MovementAsset as movementAssetQueries
} from './queries';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,
  Asset,
  AssetCategories,
  MovementAsset,
  Movement,
  Mutation: {
    ...assetCategoriesMutations,
    ...assetMutations,
    ...movementMutations
  },
  Query: {
    ...assetCategoriesQueries,
    ...assetQueries,
    ...movementQueries,
    ...movementAssetQueries
  }
});

export default resolvers;
