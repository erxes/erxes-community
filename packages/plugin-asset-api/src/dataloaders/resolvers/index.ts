import customScalars from '@erxes/api-utils/src/customScalars';
import Asset from './asset';
import AssetGroup from './assetGroup';

import {
  AssetGroup as assetGroupMutations,
  Asset as assetMutations,
  Movement as movementMutations
} from './mutations';
import {
  AssetGroup as assetGroupQueries,
  Asset as assetQueries,
  Movement as movementQueries
} from './queries';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,
  Asset,
  AssetGroup,
  Mutation: {
    ...assetGroupMutations,
    ...assetMutations,
    ...movementMutations
  },
  Query: {
    ...assetGroupQueries,
    ...assetQueries,
    ...movementQueries
  }
});

export default resolvers;
