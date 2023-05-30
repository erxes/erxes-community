import { Osms, Types } from '../../models';
import { IContext } from '@erxes/api-utils/src/types';

const osmMutations = {
  /**
   * Creates a new osm
   */
  async osmsAdd(_root, doc, _context: IContext) {
    return Osms.createOsm(doc);
  },
  /**
   * Edits a new osm
   */
  async osmsEdit(_root, { _id, ...doc }, _context: IContext) {
    return Osms.updateOsm(_id, doc);
  },
  /**
   * Removes a single osm
   */
  async osmsRemove(_root, { _id }, _context: IContext) {
    return Osms.removeOsm(_id);
  },

  /**
   * Creates a new type for osm
   */
  async osmTypesAdd(_root, doc, _context: IContext) {
    return Types.createType(doc);
  },

  async osmTypesRemove(_root, { _id }, _context: IContext) {
    return Types.removeType(_id);
  },

  async osmTypesEdit(_root, { _id, ...doc }, _context: IContext) {
    return Types.updateType(_id, doc);
  }
};

export default osmMutations;
