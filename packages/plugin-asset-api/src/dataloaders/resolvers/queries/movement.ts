import { paginate } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';

const generateFilter = params => {
  let filter: any = {};

  if (params.from) {
    filter.createdAt = { $gte: params.from };
  }
  if (params.to) {
    filter.createdAt = { ...filter.createdAt, $lt: params.to };
  }
};

const movementQueries = {
  assetMovements(_root, params, { models }: IContext) {
    const filter = generateFilter(params);

    return paginate(models.Movement.find(filter), params);
  },
  async assetMovement(_root, { _id }, { models }: IContext) {
    return await models.Movement.findOne({ _id });
  },

  assetMovementTotalCount(_root, params, { models }: IContext) {
    const filter = generateFilter(params);

    return models.Movement.find(filter).countDocuments();
  }
};

export default movementQueries;
