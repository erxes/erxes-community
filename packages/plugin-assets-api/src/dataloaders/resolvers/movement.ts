import { IMovementDocument } from '../../common/types/asset';
import { IContext } from '../../connectionResolver';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.Assets.findOne({ _id });
  },

  async user(movement: IMovementDocument, {}, { dataLoaders }: IContext) {
    return (movement.userId && dataLoaders.teamMember.load(movement.userId)) || null;
  },

  async items(movement: IMovementDocument, {}, { models }: IContext) {
    return await models.MovementItems.find({ _id: { $in: movement.itemIds } });
  },

  async selectedAssetIds(movement: IMovementDocument, {}, { models }: IContext) {
    const movementItems = await models.MovementItems.find({
      _id: { $in: movement.itemIds }
    }).lean();
    return movementItems.map(item => item.assetId);
  }
};
