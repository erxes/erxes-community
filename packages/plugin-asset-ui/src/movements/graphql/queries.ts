const movementDetail = `
query AssetMovement($_id: String) {
  assetMovement(_id: $_id) {
    _id
    assetIds
    createdAt
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
  query AssetMovements {
  assetMovements {
    _id
    assetIds
    createdAt
  }
}
`;
const movementsTotalCount = `
  query AssetMovementTotalCount {
    assetMovementTotalCount
  }
`;

export default { movements, movementDetail, movementsTotalCount };
