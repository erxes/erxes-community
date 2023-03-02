import { IContext } from '../../../connectionResolver';
import * as api from '../../../khanbankApi/api';

const queries = {
  async khanbankAccounts(
    _root,
    { configId }: { configId: string },
    { models }: IContext
  ) {
    try {
      return api.getAccounts(models, configId);
    } catch (e) {
      throw new Error(e.message);
    }
  }
};

export default queries;
