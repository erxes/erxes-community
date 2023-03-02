import { Kbcgws, Types } from '../../models';
import { IContext } from '@erxes/api-utils/src/types';

const kbcgwMutations = {
  /**
   * Creates a new kbcgw
   */
  async kbcgwsAdd(_root, doc, _context: IContext) {
    return Kbcgws.createKbcgw(doc);
  },
  /**
   * Edits a new kbcgw
   */
  async kbcgwsEdit(_root, { _id, ...doc }, _context: IContext) {
    return Kbcgws.updateKbcgw(_id, doc);
  },
  /**
   * Removes a single kbcgw
   */
  async kbcgwsRemove(_root, { _id }, _context: IContext) {
    return Kbcgws.removeKbcgw(_id);
  },

  /**
   * Creates a new type for kbcgw
   */
  async kbcgwTypesAdd(_root, doc, _context: IContext) {
    return Types.createType(doc);
  },

  async kbcgwTypesRemove(_root, { _id }, _context: IContext) {
    return Types.removeType(_id);
  },

  async kbcgwTypesEdit(_root, { _id, ...doc }, _context: IContext) {
    return Types.updateType(_id, doc);
  }
};

export default kbcgwMutations;
