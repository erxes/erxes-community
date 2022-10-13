import invoicesQueries from './invoices';
import paymentsQueries, { paymentOptionQuery } from './payments';
import paymentConfigQueries from './paymentConfigs';

export default {
  ...invoicesQueries,
  ...paymentsQueries,
  ...paymentOptionQuery,
  ...paymentConfigQueries
};
