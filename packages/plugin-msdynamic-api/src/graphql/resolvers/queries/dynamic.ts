import { IContext } from '../../../messageBroker';

const msdynamicQueries = {
  msdynamics(_root, { typeId }, { models }: IContext) {
    const selector: any = {};

    if (typeId) {
      selector.typeId = typeId;
    }

    return models.Msdynamics.find(selector).sort({ order: 1, name: 1 });
  },

  msdynamicsTotalCount(_root, _args, { models }: IContext) {
    return models.Msdynamics.find({}).countDocuments();
  }
};

export default msdynamicQueries;
