import { IContext } from '../../../connectionResolver';

const mutations = {
  async khanbankAccountConfigUpsert(_root, args, { models }: IContext) {
    const { _id, ...doc } = args;
    if (_id) {
      return models.KhanbankAccounts.updateAccount(_id, doc);
    }
    return models.KhanbankAccounts.createAccount(doc);
  },

  async khanbankAccountConfigChangeStatus(
    _root,
    { _id },
    { models }: IContext
  ) {
    return models.KhanbankAccounts.changeStatus(_id);
  },

  async khanbankAccountConfigMakeDefault(_root, { _id }, { models }: IContext) {
    await models.KhanbankAccounts.updateMany(
      {},
      { $set: { isDefault: false } }
    );

    await models.KhanbankAccounts.updateOne(
      { _id },
      { $set: { isDefault: true } }
    );

    return models.KhanbankAccounts.getAccount({ _id });
  }
};

export default mutations;
