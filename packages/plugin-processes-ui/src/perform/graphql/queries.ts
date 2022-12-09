const workFields = `
  _id
  name
  status
  flow
  inBranchId
  inDepartmentId
  outBranchId
  outDepartmentId
  startAt
  dueDate
  count
  interval
  intervalId
  needProducts
  resultProducts

  inDepartment {
    _id
    code
    title
    parentId
  }
  inBranch {
    _id
    code
    title,
    parentId
  }
  outDepartment {
    _id
    code
    title
    parentId
  }
  outBranch {
    _id
    code
    title,
    parentId
  }
`;

const works = `
  query works($page: Int, $perPage: Int, $searchValue: String) {
    works(page: $page, perPage: $perPage, searchValue: $searchValue) {
      ${workFields}
    }
  }
`;

const worksTotalCount = `
  query worksTotalCount($searchValue: String) {
    worksTotalCount(searchValue: $searchValue)
  }
`;

const paginateDefs = `
  $page: Int
  $perPage: Int
  $sortField: String
  $sortDirection: Int
`;

const paginateParams = `
  page: $page
  perPage: $perPage
  sortField: $sortField
  sortDirection: $sortDirection
`;

const detailParamsDef = `
  $startDate: Date
  $endDate: Date
  $type: String
  $inBranchId: String
  $outBranchId: String
  $inDepartmentId: String
  $outDepartmentId: String
  $productId: String
  $productCategoryId: String
  $jobReferId: String
`;

const detailParamsValue = `
  startDate: $startDate
  endDate: $endDate
  type: $type
  inBranchId: $inBranchId
  outBranchId: $outBranchId
  inDepartmentId: $inDepartmentId
  outDepartmentId: $outDepartmentId
  productId: $productId
  productCategoryId: $productCategoryId
  jobReferId: $jobReferId
`;

const userFields = `
  _id
  email
  username
  details {
    fullName
    shortName
  }
`;

export const performFields = `
  _id
  overallWorkId
  overallWorkKey {
    inBranchId
    inDepartmentId
    outBranchId
    outDepartmentId
    type
    typeId
  }
  status
  startAt
  dueDate
  endAt
  count
  inBranchId
  inDepartmentId
  outBranchId
  outDepartmentId
  needProducts
  resultProducts
  inProducts
  outProducts

  inDepartment {
    _id
    code
    title
    parentId
  }
  inBranch {
    _id
    code
    title,
    parentId
  }
  outDepartment {
    _id
    code
    title
    parentId
  }
  outBranch {
    _id
    code
    title,
    parentId
  }

  createdAt
  createdBy
  modifiedAt
  modifiedBy
  createdUser {
    ${userFields}
  }
  modifiedUser {
    ${userFields}
  }
`;

const performs = `
  query performs(${detailParamsDef}, ${paginateDefs}) {
    performs(${detailParamsValue}, ${paginateParams}) {
      ${performFields}
    }
  }
`;

const performsCount = `
  query performs(${detailParamsDef}) {
    performs(${detailParamsValue}) Int
  }
`;

export default {
  works,
  worksTotalCount,
  performs,
  performsCount
};
