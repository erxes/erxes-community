import { paginate } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import { generateFilter } from '../../../utils';

const movementItemQueries = {
  async assetMovementItems(_root, params, { models }: IContext) {
    const filter = await generateFilter(params, models);

    return paginate(models.MovementItems.find(filter, { limit: 1 }), params);
  },

  async assetMovementItemsTotalCount(_root, params, { models }: IContext) {
    const filter = await generateFilter(params, models);

    return models.MovementItems.find(filter).countDocuments();
  },

  async assetMovementItem(_root, { _id }, { models }: IContext) {
    return await models.MovementItems.findOne({ _id });
  },
  async currentLocationAssetMovementItems(_root, { assetIds }, { models }: IContext) {
    const movementItems: any[] = [];
    for (const assetId of assetIds) {
      const movementItem = await models.MovementItems.findOne({ assetId })
        .sort({ createdAt: -1 })
        .limit(1);
      movementItems.push(movementItem);
    }
    return movementItems;
  },
  async currentLocationAssetMovementItem(_root, { assetId }, { models }: IContext) {
    return await models.MovementItems.findOne({ assetId }).sort({ createdAt: -1 });
  }
};

export default movementItemQueries;
