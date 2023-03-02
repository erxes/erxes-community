import customScalars from '@erxes/api-utils/src/customScalars';

import mutations from './mutations';
import queries from './queries';
import { Types } from '../../models';

const Kbcgw = {
  currentType(kbcgw, _args) {
    return Types.findOne({ _id: kbcgw.typeId });
  }
};

const resolvers: any = async _serviceDiscovery => ({
  ...customScalars,
  Kbcgw,
  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
});

export default resolvers;
