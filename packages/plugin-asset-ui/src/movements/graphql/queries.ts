const movements = `
query AssetMovements {
    assetMovements {
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

const movementDetail = `
query AssetMovement($_id: String) {
  assetMovement(_id: $_id) {
    _id
    assetId
    assetName
    branch
    branchId
    company
    companyId
    createdAt
    customer
    customerId
    department
    departmentId
    teamMember
    teamMemberId
    userType
  }
}
`;

export default { movements, movementDetail };
