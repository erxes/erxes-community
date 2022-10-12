import { IModels } from './connectionResolver';

export async function checkCodeDuplication(models: IModels, code: string) {
  if (code.includes('/')) {
    throw new Error('The "/" character is not allowed in the code');
  }

  const group = await models.AssetGroup.findOne({
    code
  });

  if (group) {
    throw new Error('Code must be unique');
  }
}

export const generateFilter = async (params, models) => {
  let filter: any = {};

  if (params.movementId) {
    const movementItems = await models.Movement.findOne({ _id: params.movementId }).lean();

    filter._id = { $in: movementItems?.assetIds };
  }

  if (params.branchId) {
    filter.branchId = params.branchId;
  }

  if (params.departmentId) {
    filter.departmentId = params.departmentId;
  }
  if (params.teamMemberId) {
    filter.teamMemberId = params.teamMemberId;
  }
  if (params.companyId) {
    filter.companyId = params.companyId;
  }
  if (params.customerId) {
    filter.customerId = params.customerId;
  }

  if (params.from) {
    filter.createdAt = { $gte: params.from };
  }
  if (params.to) {
    filter.createdAt = { ...filter.createdAt, $lte: params.to };
  }

  if (params.searchValue) {
    filter.assetName = new RegExp(`.*${params.searchValue}.*`, 'i');
  }

  return filter;
};
