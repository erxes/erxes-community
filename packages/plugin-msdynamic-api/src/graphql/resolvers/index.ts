import customScalars from '@erxes/api-utils/src/customScalars';

import mutations from './mutations';
import queries from './queries';
import { Types } from '../../models';

const Msdynamic = {
  currentType(msdynamic, _args) {
    return Types.findOne({ _id: msdynamic.typeId });
  }
};

const resolvers: any = async _serviceDiscovery => ({
  ...customScalars,
  Msdynamic,
  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
});

export default resolvers;
