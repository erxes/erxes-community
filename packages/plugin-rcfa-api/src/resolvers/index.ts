import customScalars from '@erxes/api-utils/src/customScalars';
import { RCFA as RCFAMutations, Task as TaskMutations } from './mutations';
import { RCFA as RCFAQueries } from './queries';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,
  Mutation: {
    ...RCFAMutations,
    ...TaskMutations
  },
  Query: {
    ...RCFAQueries
  }
});

export default resolvers;
