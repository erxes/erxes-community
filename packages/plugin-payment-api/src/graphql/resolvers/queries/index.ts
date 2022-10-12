import invoicesQueries from './invoices';
import paymentsQueries, { paymentOptionQuery } from './payments';

export default {
  ...invoicesQueries,
  ...paymentsQueries,
  ...paymentOptionQuery
};
