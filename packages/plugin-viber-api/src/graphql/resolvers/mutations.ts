import { IContext } from '../../connectionResolver';
import { Integrations } from '../../models';

const viberMutations = {
  async viberIntegrationUpdate(_root, args, context: IContext) {
    const { inboxId, ...data } = args.update;
    const integration = await Integrations.findOneAndUpdate(
      { inboxId },
      { $set: { ...data } },
      {
        returnOriginal: false
      }
    );
    return integration;
  }
};

export default viberMutations;
