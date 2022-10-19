import customScalars from '@erxes/api-utils/src/customScalars';
import Asset from './asset';
import AssetCategories from './assetCategories';
import MovementItem from './movementItems';
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
  MovementItem as movementItemQueries
} from './queries';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,
  Asset,
  AssetCategories,
  MovementItem,
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
    ...movementItemQueries
  }
});

export default resolvers;
