import { IContext } from '../../connectionResolver';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.RCFA.findOne({ _id });
  },
  issues({ _id }, {}, { models }: IContext) {
    return models.Issues.find({ rcfaId: _id }) || null;
  }
};
