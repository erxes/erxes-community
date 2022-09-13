import customScalars from '@erxes/api-utils/src/customScalars';
import checkSyncedMutations from './mutations/checkSynced';
import inventoryMutations from './mutations/syncInventory';
import erkhetQueries from './queries/inventory';

const resolvers: any = async _serviceDiscovery => ({
  ...customScalars,

  Query: {
    ...erkhetQueries
  },

  Mutation: {
    ...checkSyncedMutations,
    ...inventoryMutations
  }
});

export default resolvers;
