import { IContext, generateModels } from '../../connectionResolver';
import { Types } from '../../models';

const callsQueries = {
  callss(_root, { typeId }, { models }: IContext) {
    const selector: any = {};

    if (typeId) {
      selector.typeId = typeId;
    }

    return models.Calls.find(selector).sort({ order: 1, name: 1 });
  },

  callsTypes(_root, _args, _context: IContext) {
    return Types.find({});
  },

  callssTotalCount(_root, _args, { models }: IContext) {
    return models.Calls.find({}).countDocuments();
  },

  callsIntegrationDetail(_root, { integrationId }, { models }: IContext) {
    return models.Integrations.findOne({ inboxId: integrationId });
  },

  async callsIntegrationOperator(_root, _args, { subdomain, user }: IContext) {
    const models = generateModels(subdomain);

    const res = (await models).Integrations.getIntegrationsByOperators(
      user._id
    );

    return res;
  }
};

export default callsQueries;
