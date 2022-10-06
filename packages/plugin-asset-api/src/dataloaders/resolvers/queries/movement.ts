import { paginate } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';

const movementQueries = {
  assetMovements(_root, params, { models }: IContext) {
    const result = paginate(models.Movement.find(params), params);
    return result;
  },
  assetMovement(_root, { _id }, { models }: IContext) {
    console.log(_id);
    return models.Movement.findOne({ _id });
  }
};

export default movementQueries;
