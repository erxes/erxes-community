import { IContext } from '../../connectionResolver';
import { IAssetDocument, IMovementAsset, IMovementDocument } from '../../common/types/asset';
import { ASSET_STATUSES } from '../../common/constant/asset';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.Asset.findOne({ _id });
  },

  async assets(movement: IMovementDocument, {}, { models, dataLoaders }: IContext) {
    const movementItems = await models.MovementAsset.find({
      _id: { $in: movement.assetIds }
    }).lean();
    movementItems.map(item => ({
      ...item,
      branch: (item.branchId && dataLoaders.branch.load(item.branchId)) || null,
      teamMember: (item.teamMemberId && dataLoaders.teamMember.load(item.teamMemberId)) || null,
      customer: (item.customer && dataLoaders.customer.load(item.customer)) || null,
      company: (item.company && dataLoaders.company.load(item.company)) || null,
      department: (item.departmentId && dataLoaders.department.load(item.departmentId)) || null
    }));
    return movementItems;
  },

  async user(movement: IMovementDocument, {}, { models, dataLoaders }: IContext) {
    return (movement.userId && dataLoaders.teamMember.load(movement.userId)) || null;
  },

  async selectedItems(movement: IMovementDocument, {}, { models, dataLoaders }: IContext) {
    const movementItems = await models.MovementAsset.find({
      _id: { $in: movement.assetIds }
    }).lean();
    const assetIds = movementItems.map(item => item.assetId);
    return models.Asset.find({ _id: { $in: assetIds } });
  }
};
