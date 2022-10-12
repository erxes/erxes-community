import { dateFilterParams, dateFilterParamsDef } from '../../common/graphql/movement';

const movementDetail = `
query AssetMovement($_id: String) {
  assetMovement(_id: $_id) {
    _id
    assetIds
    createdAt
    movedAt
    userId
    description
    selectedItems
    assets {
      _id
      assetId
      assetName
      branchId
      companyId
      createdAt
      customerId
      departmentId
      teamMemberId

      branch
      department
      company
      customer
      teamMember
    }
  }
}
`;

const movements = `
  query AssetMovements ($userId:String,${dateFilterParams}) {
  assetMovements (userId:$userId,${dateFilterParamsDef}) {
    _id
    assetIds
    createdAt
    movedAt
    userId
    user
  }
}
`;
const movementsTotalCount = `
  query AssetMovementTotalCount {
    assetMovementTotalCount
  }
`;

export default { movements, movementDetail, movementsTotalCount };
