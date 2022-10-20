import { isEnabled } from '@erxes/ui/src/utils/core';
import {
  dateFilterParams,
  dateFilterParamsDef,
  movementFilterParams,
  movementFilterParamsDef
} from '../../../common/graphql/movement';

const itemsType = `
    _id
    assetId
    assetName
    branchId
    companyId
    customerId
    departmentId
    teamMemberId
    movementId
    createdAt
    ${
      isEnabled('contacts')
        ? `
      branch
      department
      company
      customer
      teamMember

      `
        : ``
    }
`;

const items = `
query AssetMovementItems ($movementId:String,${movementFilterParams},${dateFilterParams}) {
  assetMovementItems(movementId: $movementId,${movementFilterParamsDef},${dateFilterParamsDef}) {
    ${itemsType}
    sourceLocations 
    }
  }
`;

const itemsTotalCount = `
  query AssetMovementItemsTotalCount(${movementFilterParams},${dateFilterParams}) {
  assetMovementItemsTotalCount(${movementFilterParamsDef},${dateFilterParamsDef})
}
`;

export default { items, itemsTotalCount };
