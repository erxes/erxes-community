import { IContext } from '../../../connectionResolver';
import { MODULE_NAMES, putCreateLog } from '../../../logUtils';

const movementMutations = {
  async assetMovementAdd(_root, doc, { user, docModifier, models, subdomain }: IContext) {
    const movement = await models.Movement.movementAdd(docModifier(doc), user._id);

    await putCreateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.MOVEMENT,
        newData: { ...doc.movements },
        object: movement
      },
      user
    );
  },
  async assetMovementRemove(_root, { _id }, { models }: IContext) {
    return await models.Movement.movementRemove();
  }
};

export default movementMutations;
