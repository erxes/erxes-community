import {
  getAccountBalance,
  getAccountDetail,
  getAccounts
} from '../../../api/accounts';
import { IContext } from '../../../connectionResolver';

const queries = {
  async khanbankAccounts(
    _root,
    { configId }: { configId: string },
    { models }: IContext
  ) {
    try {
      return getAccounts(models, configId);
    } catch (e) {
      throw new Error(e.message);
    }
  },

  async khanbankAccountBalance(
    _root,
    { configId, accountNumber }: { configId: string; accountNumber: string },
    { models }: IContext
  ) {
    try {
      return getAccountBalance(models, configId, accountNumber);
    } catch (e) {
      throw new Error(e.message);
    }
  },

  async khanbankAccountDetail(
    _root,
    { configId, accountNumber }: { configId: string; accountNumber: string },
    { models }: IContext
  ) {
    try {
      return getAccountDetail(models, configId, accountNumber);
    } catch (e) {
      throw new Error(e.message);
    }
  }
};

export default queries;
