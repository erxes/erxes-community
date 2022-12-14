export const commonPaginateDef = `
    $page:Int
    $perPage:Int
    $sortField: String,
    $sortDirection: Int,
    $searchValue: String,
    $sortFromDate:String
    $sortToDate:String
`;
export const commonPaginateValue = `
    page:$page
    perPage:$perPage
    sortField:$sortField,
    sortDirection:$sortDirection,
    searchValue:$searchValue,
    sortFromDate:$sortFromDate
    sortToDate:$sortToDate
`;

export const riskAssessmentDef = `
    $categoryId: String,
    $description: String,
    $name: String!,
    $calculateMethod: String,
`;

export const riskAssessmentValues = `
    categoryId: $categoryId,
    description: $description,
    name: $name,
    calculateMethod: $calculateMethod
`;

export const riskAssessmentCategoryParams = `
_id
formId
parentId
name
code
order
type
`;

export const riskAssessmentParams = `
    _id,
    name,
    description,
    status,
    statusColor,
    categoryId,
    createdAt,
    resultScore,
    category{
        _id
        formId
        parentId
        name
    },
    calculateMethod,
    calculateLogics {
        _id
        logic
        name
        value
        value2
        color
      }
`;

export const riskConformityParams = `
    _id
    categoryId
    createdAt
    description
    name
    status
`;
