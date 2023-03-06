import configQueries from './configs';
import accountQueries from './accounts';
import taxQueries from './taxes';

export default {
  ...configQueries,
  ...accountQueries,
  ...taxQueries
};
