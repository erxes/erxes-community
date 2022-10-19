import { paginate } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import { generateFilter } from '../../../utils';

const movementItemQueries = {
  async assetMovementItems(_root, params, { models }: IContext) {
    const filter = await generateFilter(params, models);

    return paginate(models.MovementItems.find(filter), params);
  },

  async assetMovementItemsTotalCount(_root, params, { models }: IContext) {
    const filter = await generateFilter(params, models);

    return models.MovementItems.find(filter).countDocuments();
  },

  async assetMovementItem(_root, { _id }, { models }: IContext) {
    return await models.MovementItems.findOne({ _id });
  }
};

export default movementItemQueries;
