import { isEnabled } from '@erxes/ui/src/utils/core';
import { dateFilterParams, dateFilterParamsDef } from '../../common/graphql/movement';

const fieldAviableEnabledContacts = `
    branch
    department
    company
    customer
    teamMember
`;
const commonItemFields = `
    branchId
    companyId
    customerId
    departmentId
    teamMemberId
`;

const movementDetail = `
query AssetMovement($_id: String) {
  assetMovement(_id: $_id) {
    _id
    itemIds
    createdAt
    movedAt
    userId
    description
    items {
        _id,
        assetName,
        assetId,
        ${commonItemFields}
        createdAt
        sourceLocations {
                ${commonItemFields}
                ${isEnabled('contacts') ? fieldAviableEnabledContacts : ``}
        },

        ${isEnabled('contacts') ? fieldAviableEnabledContacts : ``}
    }
  }
}
`;

const movements = `
  query AssetMovements ($userId:String,$searchValue:String,${dateFilterParams}) {
  assetMovements (userId:$userId,searchValue:$searchValue,${dateFilterParamsDef}) {
    _id
    itemIds
    description
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
query CurrentAssetMovementItems($assetIds: [String]) {
  currentAssetMovementItems(assetIds: $assetIds) {
    assetId
    assetName
    ${commonItemFields}
    ${isEnabled('contacts') ? fieldAviableEnabledContacts : ``}
    sourceLocations {
      ${commonItemFields}

      ${isEnabled('contacts') ? fieldAviableEnabledContacts : ``}
    }
  }
}
`;

export default {
  movements,
  movementDetail,
  movementsTotalCount,
  itemsCurrentLocation
};
