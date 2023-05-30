import customScalars from '@erxes/api-utils/src/customScalars';

import mutations from './mutations';
import queries from './queries';
import { Types } from '../../models';

const Osm = {
  currentType(osm, _args) {
    return Types.findOne({ _id: osm.typeId });
  }
};

const resolvers: any = async _serviceDiscovery => ({
  ...customScalars,
  Osm,
  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
});

export default resolvers;
