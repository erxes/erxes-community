import { IContext } from '@erxes/api-utils/src/types';
// import { ViberSentMessage } from '../../models';

const queries = {
  viberReadSentMessage(_root, _args, _context: IContext) {
    return [];
    // return ViberSentMessage.find({ userId: _context.user._id });
  }
};

export default queries;
