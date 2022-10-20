export const movementParams = `
    _id:String,
    userType:String,
    branches:[String],
    departments:[String],
    customers:[String],
    teamMember:[String],
    company:[String],
`;

export const movementFilters = `
    movementId:String,
    branchId:String,
    departmentId:String,
    customerId:String,
    companyId:String,
    teamMemberId:String,
    assetId:String,
    assetIds:[String]
    movedAtFrom:String,
    movedAtTo:String,
    modifiedAtFrom:String,
    modifiedAtTo:String,
    createdAtFrom:String,
    createdAtTo:String,
    searchValue:String,
    userId:String,
`;
