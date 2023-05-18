import customScalars from '@erxes/api-utils/src/customScalars';
import {
  rfcaMutations,
  rfcaQuestionMutations,
  relatedTaskMutations
} from './mutations';
import { rfcaQuestionQueries } from './queries';

const resolvers: any = async (serviceDiscovery: any) => ({
  ...customScalars,
  Mutation: {
    ...rfcaMutations,
    ...rfcaQuestionMutations,
    ...relatedTaskMutations
  },
  Query: {
    ...rfcaQuestionQueries
  }
});

export default resolvers;
