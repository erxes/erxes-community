import customScalars from '@erxes/api-utils/src/customScalars';

import Invoice from './invoice';
import mutations from './mutations';
import queries from './queries';

const resolvers: any = async () => ({
  ...customScalars,

  Invoice,
  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
});

export default resolvers;
