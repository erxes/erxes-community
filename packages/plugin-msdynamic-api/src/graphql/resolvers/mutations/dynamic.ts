import { IContext } from '../../../messageBroker';

const msdynamicMutations = {
  /**
   * Creates a new msdynamic
   */
  async msdynamicsAdd(_root, doc, { models }: IContext) {
    const dynamic = await models.Msdynamics.createMsdynamic(doc);

    return dynamic;
  },
  /**
   * Edits a new msdynamic
   */
  async msdynamicsEdit(_root, doc, { models }: IContext) {
    return await models.Msdynamics.updateMsdynamic(doc);
  },
  /**
   * Removes a single msdynamic
   */
  async msdynamicsRemove(_root, { _id }, { models }: IContext) {
    return await models.Msdynamics.removeMsdynamic(_id);
  }
};

export default msdynamicMutations;
