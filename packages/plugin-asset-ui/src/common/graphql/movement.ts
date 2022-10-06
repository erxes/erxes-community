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
