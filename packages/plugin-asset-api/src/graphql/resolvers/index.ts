import customScalars from '@erxes/api-utils/src/customScalars';

import { AssetGroup as assetGroupMutations, Asset as assetMutations } from './mutations';
import { AssetGroup as assetGroupQueries, Asset as assetQueries } from './queries';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,
  Mutation: {
    ...assetGroupMutations,
    ...assetMutations
  },
  Query: {
    ...assetGroupQueries,
    ...assetQueries
  }
});

export default resolvers;
