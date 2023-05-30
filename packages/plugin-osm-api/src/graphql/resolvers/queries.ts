import { Osms, Types } from '../../models';
import { IContext } from '@erxes/api-utils/src/types';

const osmQueries = {
  osms(_root, { typeId }, _context: IContext) {
    const selector: any = {};

    if (typeId) {
      selector.typeId = typeId;
    }

    return Osms.find(selector).sort({ order: 1, name: 1 });
  },

  osmTypes(_root, _args, _context: IContext) {
    return Types.find({});
  },

  osmsTotalCount(_root, _args, _context: IContext) {
    return Osms.find({}).countDocuments();
  }
};

export default osmQueries;
