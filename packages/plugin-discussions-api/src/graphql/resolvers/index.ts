import customScalars from '@erxes/api-utils/src/customScalars';
import DiscussionMutations from './discussionMutations';
import DiscussionQueries from './discussionQueries';
import { Discussion } from './discussion';

const resolvers: any = {
  ...customScalars,
  Discussion,
  Mutation: {
    ...DiscussionMutations
  },
  Query: {
    ...DiscussionQueries
  }
};

export default resolvers;
