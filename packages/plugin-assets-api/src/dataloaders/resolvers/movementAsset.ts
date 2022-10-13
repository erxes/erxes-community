import { IContext } from '../../connectionResolver';
import { IMovementAssetDocument } from '../../common/types/asset';
export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.Movement.findOne({ _id });
  },

  async branch(movement: IMovementAssetDocument, {}, { models, dataLoaders }: IContext) {
    return (movement.branchId && dataLoaders.branch.load(movement.branchId)) || null;
  },
  async customer(movement: IMovementAssetDocument, {}, { models, dataLoaders }: IContext) {
    return (movement.customerId && dataLoaders.customer.load(movement.customerId)) || null;
  },
  async company(movement: IMovementAssetDocument, {}, { models, dataLoaders }: IContext) {
    return (movement.companyId && dataLoaders.company.load(movement.companyId)) || null;
  },
  async teamMember(movement: IMovementAssetDocument, {}, { dataLoaders }: IContext) {
    return (movement.teamMemberId && dataLoaders.teamMember.load(movement.teamMemberId)) || null;
  },
  async department(movement: IMovementAssetDocument, {}, { models, dataLoaders }: IContext) {
    return (movement.departmentId && dataLoaders.department.load(movement.departmentId)) || null;
  }
};
