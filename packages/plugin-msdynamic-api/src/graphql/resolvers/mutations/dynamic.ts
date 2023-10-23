import { IContext } from '../../../messageBroker';

const msdynamicMutations = {
  /**
   * Creates a new msdynamic
   */
  async msdynamicsAdd(_root, doc, { models }: IContext) {
    return models.Msdynamics.createMsdynamic(doc);
  },
  /**
   * Edits a new msdynamic
   */
  async msdynamicsEdit(_root, doc, { models }: IContext) {
    return models.Msdynamics.updateMsdynamic(doc);
  },
  /**
   * Removes a single msdynamic
   */
  async msdynamicsRemove(_root, { _id }, { models }: IContext) {
    return models.Msdynamics.removeMsdynamic(_id);
  }
};

export default msdynamicMutations;
