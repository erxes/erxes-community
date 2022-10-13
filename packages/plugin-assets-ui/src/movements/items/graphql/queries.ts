import {
  dateFilterParams,
  dateFilterParamsDef,
  movementFilterParams,
  movementFilterParamsDef
} from '../../../common/graphql/movement';

const items = `
query AssetMovementAssets ($movementId:String,${movementFilterParams},${dateFilterParams}) {
  assetMovementAssets(movementId: $movementId,${movementFilterParamsDef},${dateFilterParamsDef}) {
      _id
      assetId
      assetName
      userType
      branchId
      companyId
      customerId
      departmentId
      teamMemberId
      createdAt

      branch
      department
      company
      customer
      teamMember
    }
  }
`;

const itemsTotalCount = `
  query AssetMovementItemsTotalCount(${movementFilterParams},${dateFilterParams}) {
  assetMovementItemsTotalCount(${movementFilterParamsDef},${dateFilterParamsDef})
}
`;

export default { items, itemsTotalCount };
