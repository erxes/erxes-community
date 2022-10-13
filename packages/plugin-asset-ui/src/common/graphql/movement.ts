export const movementParamsDef = `
    $assetId:String,
    $assetName:String,
    $userType:String,
    $branchId:String,
    $departmentId:String,
    $customerId:String,
    $teamMemberId:String,
    $companyId:String,
`;

export const movementParams = `
    assetId:$assetId,
    assetName:$assetName,
    userType:$userType
    branchId:$branchId
    departmentId:$departmentId
    customerId:$customerId
    teamMemberId:$teamMemberId
    companyId:$companyId
`;

export const movementFilterParams = `
    $branchId:String,
    $departmentId:String,
    $customerId:String,
    $teamMemberId:String,
    $companyId:String,
    $searchValue:String
`;

export const movementFilterParamsDef = `
    branchId:$branchId
    departmentId:$departmentId
    customerId:$customerId
    teamMemberId:$teamMemberId
    companyId:$companyId
    searchValue:$searchValue
`;

export const dateFilterParams = `
    $movedAtFrom :String,
    $movedAtTo :String,
    $createdAtFrom :String,
    $createdAtTo :String
`;
export const dateFilterParamsDef = `
    movedAtFrom : $movedAtFrom,
    movedAtTo: $movedAtTo,
    createdAtFrom : $createdAtFrom,
    createdAtTo: $createdAtTo
`;
