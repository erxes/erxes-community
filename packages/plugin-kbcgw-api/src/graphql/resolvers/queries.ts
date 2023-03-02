import { Kbcgws, Types } from '../../models';
import { IContext } from '@erxes/api-utils/src/types';

const kbcgwQueries = {
  kbcgws(_root, { typeId }, _context: IContext) {
    const selector: any = {};

    if (typeId) {
      selector.typeId = typeId;
    }

    return Kbcgws.find(selector).sort({ order: 1, name: 1 });
  },

  kbcgwTypes(_root, _args, _context: IContext) {
    return Types.find({});
  },

  kbcgwsTotalCount(_root, _args, _context: IContext) {
    return Kbcgws.find({}).countDocuments();
  }
};

export default kbcgwQueries;
