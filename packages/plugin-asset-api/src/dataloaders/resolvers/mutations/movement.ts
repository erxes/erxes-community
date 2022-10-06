import { IContext } from '../../../connectionResolver';
import { MODULE_NAMES, putCreateLog } from '../../../logUtils';

const movementMutations = {
  async assetMovementAdd(_root, doc, { user, docModifier, models, subdomain }: IContext) {
    const movement = await models.Movement.movementAdd(docModifier(doc));

    await putCreateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.MOVEMENT,
        newData: { ...doc },
        object: movement
      },
      user
    );
  }
};

export default movementMutations;
