import { isEnabled } from '@erxes/ui/src/utils/core';
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

      ${
        isEnabled('contacts')
          ? `
        branch
        department
        company
        customer
        teamMember
        `
          : ''
      }
    }
  }
}
`;

isEnabled;

const movements = `
  query AssetMovements ($userId:String,${dateFilterParams}) {
  assetMovements (userId:$userId,${dateFilterParamsDef}) {
    _id
    assetIds
    createdAt
    modifiedAt
    movedAt
    userId
    user
  }
}
`;
const movementsTotalCount = `
  query AssetMovementTotalCount(${dateFilterParams}) {
    assetMovementTotalCount(${dateFilterParamsDef})
  }
`;

export default { movements, movementDetail, movementsTotalCount };
