import { IContext } from '../../connectionResolver';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.Assessments.findOne({ _id });
  },
  item({ itemId }, {}, { models }: IContext) {
    return models.Items.findOne({ _id: itemId }) || null;
  }
};
