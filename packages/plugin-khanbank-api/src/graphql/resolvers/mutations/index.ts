import configMutations from './configs';
import transferMutations from './transfer';
import accountMutations from './accounts';

export default {
  ...configMutations,
  ...transferMutations,
  ...accountMutations
};
