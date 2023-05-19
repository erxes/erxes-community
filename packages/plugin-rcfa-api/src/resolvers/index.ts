import customScalars from '@erxes/api-utils/src/customScalars';
import {
  rfcaMutations,
  rfcaQuestionMutations,
  relatedTaskMutations
} from './mutations';
import { rfcaQueries, rfcaQuestionQueries } from './queries';

const resolvers: any = async (serviceDiscovery: any) => ({
  ...customScalars,
  Mutation: {
    ...rfcaMutations,
    ...rfcaQuestionMutations,
    ...relatedTaskMutations
  },
  Query: {
    ...rfcaQueries,
    ...rfcaQuestionQueries
  }
});

export default resolvers;
