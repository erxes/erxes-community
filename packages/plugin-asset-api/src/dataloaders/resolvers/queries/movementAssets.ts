import { paginate } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import { generateFilter } from '../../../utils';

const movementAssetQueries = {
  async assetMovementAssets(_root, params, { models }: IContext) {
    const filter = await generateFilter(params, models);

    return paginate(models.MovementAsset.find(filter), params);
  },

  async assetMovementItemsTotalCount(_root, params, { models }: IContext) {
    const filter = await generateFilter(params, models);

    return models.MovementAsset.find(filter).countDocuments();
  },

  async assetMovementAsset(_root, { _id }, { models }: IContext) {
    return await models.MovementAsset.findOne({ _id });
  }
};

export default movementAssetQueries;
