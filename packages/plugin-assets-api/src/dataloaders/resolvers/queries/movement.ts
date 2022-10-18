import { paginate } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import { generateFilter } from '../../../utils';

const movementQueries = {
  async assetMovements(_root, params, { models }: IContext) {
    const filter = await generateFilter(params, models);

    return paginate(models.Movement.find(filter), params);
  },
  async assetMovement(_root, { _id }, { models }: IContext) {
    return await models.Movement.findOne({ _id });
  },

  async assetMovementTotalCount(_root, params, { models }: IContext) {
    const filter = await generateFilter(params, models);

    return models.Movement.find(filter).countDocuments();
  }
};

export default movementQueries;
