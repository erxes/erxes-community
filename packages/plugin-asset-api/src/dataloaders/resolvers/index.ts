import customScalars from '@erxes/api-utils/src/customScalars';
import Asset from './asset';
import AssetGroup from './assetGroup';
import MovementAsset from './movementAsset';
import Movement from './movement';

import { AssetGroup as assetGroupMutations, Asset as assetMutations, Movement as movementMutations } from './mutations';
import {
  AssetGroup as assetGroupQueries,
  Asset as assetQueries,
  Movement as movementQueries,
  MovementAsset as movementAssetQueries
} from './queries';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,
  Asset,
  AssetGroup,
  MovementAsset,
  Movement,
  Mutation: {
    ...assetGroupMutations,
    ...assetMutations,
    ...movementMutations
  },
  Query: {
    ...assetGroupQueries,
    ...assetQueries,
    ...movementQueries,
    ...movementAssetQueries
  }
});

export default resolvers;
