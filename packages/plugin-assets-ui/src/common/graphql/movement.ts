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
    $assetId:String,
    $searchValue:String
`;

export const movementFilterParamsDef = `
    branchId:$branchId
    departmentId:$departmentId
    customerId:$customerId
    teamMemberId:$teamMemberId
    companyId:$companyId
    assetId:$assetId
    searchValue:$searchValue
`;

export const dateFilterParams = `
    $movedAtFrom :String,
    $movedAtTo :String,
    $modifiedAtFrom :String,
    $modifiedAtTo :String,
    $createdAtFrom :String,
    $createdAtTo :String
`;
export const dateFilterParamsDef = `
    movedAtFrom : $movedAtFrom,
    movedAtTo: $movedAtTo,
    modifiedAtFrom : $modifiedAtFrom,
    modifiedAtTo: $modifiedAtTo,
    createdAtFrom : $createdAtFrom,
    createdAtTo: $createdAtTo
`;
