import { IMovementItemDocument } from '../../common/types/asset';
import { IContext } from '../../connectionResolver';
export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.Movements.findOne({ _id });
  },

  async branch(movement: IMovementItemDocument, {}, { models, dataLoaders }: IContext) {
    return (movement.branchId && dataLoaders.branch.load(movement.branchId)) || null;
  },
  async customer(movement: IMovementItemDocument, {}, { models, dataLoaders }: IContext) {
    return (movement.customerId && dataLoaders.customer.load(movement.customerId)) || null;
  },
  async company(movement: IMovementItemDocument, {}, { models, dataLoaders }: IContext) {
    return (movement.companyId && dataLoaders.company.load(movement.companyId)) || null;
  },
  async teamMember(movement: IMovementItemDocument, {}, { dataLoaders }: IContext) {
    return (movement.teamMemberId && dataLoaders.teamMember.load(movement.teamMemberId)) || null;
  },
  async department(movement: IMovementItemDocument, {}, { models, dataLoaders }: IContext) {
    return (movement.departmentId && dataLoaders.department.load(movement.departmentId)) || null;
  },
  async sourceLocations(
    { sourceLocations }: IMovementItemDocument,
    {},
    { models, dataLoaders }: IContext
  ) {
    return {
      branchId: (sourceLocations.branchId && sourceLocations.branchId) || null,
      departmentId: (sourceLocations.departmentId && sourceLocations.departmentId) || null,
      customerId: (sourceLocations.customerId && sourceLocations.customerId) || null,
      companyId: (sourceLocations.companyId && sourceLocations.companyId) || null,
      teamMemberId: (sourceLocations.teamMemberId && sourceLocations.teamMemberId) || null,
      branch:
        (sourceLocations.branchId && dataLoaders.branch.load(sourceLocations.branchId)) || null,
      teamMember:
        (sourceLocations.teamMemberId &&
          dataLoaders.teamMember.load(sourceLocations.teamMemberId)) ||
        null,
      customer:
        (sourceLocations.customerId && dataLoaders.customer.load(sourceLocations.customerId)) ||
        null,
      company:
        (sourceLocations.companyId && dataLoaders.company.load(sourceLocations.companyId)) || null,
      department:
        (sourceLocations.departmentId &&
          dataLoaders.department.load(sourceLocations.departmentId)) ||
        null
    };
  }
};
