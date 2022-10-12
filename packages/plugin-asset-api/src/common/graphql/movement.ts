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
    from:String,
    to:String,
    searchValue:String,
    userId:String,
`;
