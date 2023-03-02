import customScalars from '@erxes/api-utils/src/customScalars';

import mutations from './mutations';
import queries from './queries';
import { KhanbankAccount } from './accounts';

const resolvers: any = async () => ({
  ...customScalars,

  KhanbankAccount,

  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
});

export default resolvers;
