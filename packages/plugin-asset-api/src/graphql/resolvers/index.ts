import customScalars from '@erxes/api-utils/src/customScalars';

import { AssetGroup as assetGroupMutations } from './mutations';
import { assetGroup as assetGroupQueries } from './queries';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,
  Mutation: {
    ...assetGroupMutations
  },
  Query: {
    ...assetGroupQueries
  }
});

export default resolvers;
