import { IContext } from '../../../connectionResolver';
import Khanbank from '../../../khanbank/khanbank';

const queries = {
  khanbankTaxGetCustomerTIN: async (
    _root: any,
    args: { configId },
    { models }: IContext
  ) => {
    return null;
  }
};

export default queries;
