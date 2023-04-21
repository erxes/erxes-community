import { Accounts } from '../../models';
import { IContext } from '@erxes/api-utils/src/types';

const viberMutations = {
  async viberAccountRemove(
    _root,
    { _id }: { _id: string },
    _context: IContext
  ) {
    await Accounts.removeAccount(_id);

    return 'deleted';
  },
  async viberSendMessageCreate(_root, body, _context: IContext) {
    return 'done';
  }
};

export default viberMutations;
