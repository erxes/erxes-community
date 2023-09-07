import { IContext } from '../../connectionResolver';
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
  }
};

export default callsQueries;
