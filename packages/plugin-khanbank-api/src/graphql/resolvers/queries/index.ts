import configQueries from './configs';
import accountQueries from './accounts';
import taxQueries from './taxes';
import { sendRequest } from '@erxes/api-utils/src';

export default {
  ...configQueries,
  ...accountQueries,
  ...taxQueries,

  khanbankRates: async (_root, _args, _context) => {
    try {
      return await sendRequest({
        url: 'https://api.khanbank.com/v1/rates',
        method: 'GET'
      });
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }
};
