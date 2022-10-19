export const generateFilter = async (params, models) => {
  let filter: any = {};

  if (params.movementId) {
    const movementItems = await models.Movement.findOne({ _id: params.movementId }).lean();

    filter._id = { $in: movementItems?.assetIds };
  }

  if (params.assetId) {
    filter.assetId = params.assetId;
  }

  if (params.userId) {
    filter.userId = params.userId;
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

  if (params.createdAtFrom) {
    filter.createdAt = { $gt: new Date(params.createdAtFrom) };
  }
  if (params.createdAtTo) {
    filter.createdAt = {
      ...filter.createdAt,
      $lt: new Date(params.createdAtTo)
    };
  }

  if (params.movedAtFrom) {
    filter.movedAt = { $gt: new Date(params.movedAtFrom) };
  }
  if (params.movedAtTo) {
    filter.movedAt = { ...filter.movedAt, $lt: new Date(params.movedAtTo) };
  }

  if (params.modifiedAtFrom) {
    filter.modifiedAt = { $gt: new Date(params.modifiedAtFrom) };
  }
  if (params.modifiedAtTo) {
    filter.modifiedAt = { ...filter.modifiedAt, $lt: new Date(params.modifiedAtTo) };
  }

  if (params.searchValue) {
    filter.assetName = new RegExp(`.*${params.searchValue}.*`, 'i');
  }

  return filter;
};
