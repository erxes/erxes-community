import { isEnabled } from '@erxes/ui/src/utils/core';
import { dateFilterParams, dateFilterParamsDef } from '../../common/graphql/movement';

const fieldAviableEnabledContacts = `
branch
department
company
customer
teamMember
`;

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

      ${isEnabled('contacts') ? `${fieldAviableEnabledContacts}` : ''}
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

const itemsCurrentLocation = `
query CurrentLocationAssetMovementItems($assetIds: [String]) {
  currentLocationAssetMovementItems(assetIds: $assetIds) {
    assetId
    assetName
    branchId
    companyId
    createdAt
    customerId
    departmentId
    movementId
    teamMemberId
    ${isEnabled('contacts') ? fieldAviableEnabledContacts : ``}
    sourceLocations {
      branchId
      companyId
      customerId
      departmentId
      teamMemberId

      ${isEnabled('contacts') ? fieldAviableEnabledContacts : ``}
    }
  }
}
`;

const itemCurrentLocation = `
query CurrentLocationAssetMovementItem($assetId: String) {
  currentLocationAssetMovementItem(assetId: $assetId) {
    assetId
    assetName
    branchId
    companyId
    createdAt
    customerId
    departmentId
    movementId
    teamMemberId
    ${isEnabled('contacts') ? fieldAviableEnabledContacts : ``}
    sourceLocations {
      branchId
      companyId
      customerId
      departmentId
      teamMemberId

      ${isEnabled('contacts') ? fieldAviableEnabledContacts : ``}
    }
  }
}
`;

export default {
  movements,
  movementDetail,
  movementsTotalCount,
  itemsCurrentLocation,
  itemCurrentLocation
};
