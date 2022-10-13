import paymentsMutations from './payments';
import paymentConfigMutations from './paymentConfigs';

export default {
  ...paymentsMutations,
  ...paymentConfigMutations
};
