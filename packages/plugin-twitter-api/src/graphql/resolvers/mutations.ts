import { IContext } from '../../connectionResolver';

const twitterMutations = {
  async twitterAccountRemove(
    _root,
    { _id }: { _id: string },
    { models }: IContext
  ) {
    await models.Accounts.deleteOne({ _id });
  }
};

export default twitterMutations;
