import { Msdynamics, Types } from '../../models';
import { IContext } from '@erxes/api-utils/src/types';

const msdynamicQueries = {
  msdynamics(_root, { typeId }, _context: IContext) {
    const selector: any = {};

    if (typeId) {
      selector.typeId = typeId;
    }

    return Msdynamics.find(selector).sort({ order: 1, name: 1 });
  },

  msdynamicTypes(_root, _args, _context: IContext) {
    return Types.find({});
  },

  msdynamicsTotalCount(_root, _args, _context: IContext) {
    return Msdynamics.find({}).countDocuments();
  }
};

export default msdynamicQueries;
