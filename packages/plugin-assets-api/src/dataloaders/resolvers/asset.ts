import { IContext } from '../../connectionResolver';
import { IAssetDocument } from '../../common/types/asset';
import { ASSET_STATUSES } from '../../common/constant/asset';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.Asset.findOne({ _id });
  },

  category(asset: IAssetDocument, _, { dataLoaders }: IContext) {
    return (asset.categoryId && dataLoaders.assetCategories.load(asset.categoryId)) || null;
  },

  parent(asset: IAssetDocument, _, { dataLoaders }: IContext) {
    return (asset.parentId && dataLoaders.asset.load(asset.parentId)) || null;
  },

  isRoot(asset: IAssetDocument, {}) {
    return asset.parentId ? false : true;
  },

  async chidlAssetCount(asset: IAssetDocument, {}, { models }: IContext) {
    const asset_ids = await models.Asset.find(
      { order: { $regex: new RegExp(asset.order) } },
      { _id: 1 }
    );

    return models.Asset.countDocuments({
      parentId: { $in: asset_ids },
      status: { $ne: ASSET_STATUSES.DELETED }
    });
  },

  async currentMovement(asset: IAssetDocument, {}, { models, dataLoaders }: IContext) {
    const branch =
      (asset.currentMovement?.branchId &&
        dataLoaders.branch.load(asset.currentMovement?.branchId)) ||
      null;
    const department =
      (asset.currentMovement?.departmentId &&
        dataLoaders.department.load(asset.currentMovement?.departmentId)) ||
      null;
    const teamMember =
      (asset.currentMovement?.teamMemberId &&
        dataLoaders.teamMember.load(asset.currentMovement?.teamMemberId)) ||
      null;
    const customer =
      (asset.currentMovement?.customerId &&
        dataLoaders.customer.load(asset.currentMovement?.customerId)) ||
      null;
    const company =
      (asset.currentMovement?.companyId &&
        dataLoaders.company.load(asset.currentMovement?.companyId)) ||
      null;
    return { ...asset.currentMovement, branch, department, teamMember, customer, company };
  },

  vendor(asset: IAssetDocument, _, { dataLoaders }: IContext) {
    return (asset.vendorId && dataLoaders.company.load(asset.vendorId)) || null;
  }
};
