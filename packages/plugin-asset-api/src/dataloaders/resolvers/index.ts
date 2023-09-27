import customScalars from '@erxes/api-utils/src/customScalars';
import Asset from './asset';
import AssetCategory from './assetCategory';

import {
  Assets as Mutations,
  AssetConfigs as MutationsAssetConfig,
  Uoms as MutationsUom
} from './mutations';

import {
  Assets as Queries,
  AssetConfigs as QueriesAssetConfig,
  Uoms as QueriesUom
} from './queries';

const resolvers: any = {
  ...customScalars,
  Asset,
  AssetCategory,
  Mutation: {
    ...Mutations,
    ...MutationsAssetConfig,
    ...MutationsUom
  },
  Query: {
    ...Queries,
    ...QueriesAssetConfig,
    ...QueriesUom
  }
};

export default resolvers;
