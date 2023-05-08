import customScalars from '@erxes/api-utils/src/customScalars';
import mutations from './mutations';
import queries from './queries';
import LmsCategory from './lmsCategory';
const resolvers: any = {
  ...customScalars,
  LmsCategory,
  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
};

export default resolvers;
