import { Msdynamics, Types } from '../../models';
import { IContext } from '@erxes/api-utils/src/types';

const msdynamicMutations = {
  /**
   * Creates a new msdynamic
   */
  async msdynamicsAdd(_root, doc, _context: IContext) {
    return Msdynamics.createMsdynamic(doc);
  },
  /**
   * Edits a new msdynamic
   */
  async msdynamicsEdit(_root, { _id, ...doc }, _context: IContext) {
    return Msdynamics.updateMsdynamic(_id, doc);
  },
  /**
   * Removes a single msdynamic
   */
  async msdynamicsRemove(_root, { _id }, _context: IContext) {
    return Msdynamics.removeMsdynamic(_id);
  },

  /**
   * Creates a new type for msdynamic
   */
  async msdynamicTypesAdd(_root, doc, _context: IContext) {
    return Types.createType(doc);
  },

  async msdynamicTypesRemove(_root, { _id }, _context: IContext) {
    return Types.removeType(_id);
  },

  async msdynamicTypesEdit(_root, { _id, ...doc }, _context: IContext) {
    return Types.updateType(_id, doc);
  }
};

export default msdynamicMutations;
