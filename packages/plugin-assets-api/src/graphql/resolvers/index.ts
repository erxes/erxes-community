import customScalars from '@erxes/api-utils/src/customScalars';

import mutations from './mutations';
import queries from './queries';
import AssetsCategory from './assets';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,

  AssetsCategory,

  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
});

export default resolvers;
