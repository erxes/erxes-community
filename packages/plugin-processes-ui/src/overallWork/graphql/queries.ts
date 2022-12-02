const listParamsDef = `
  $page: Int
  $perPage: Int
  $sortField: String
  $sortDirection: Int
  $search: String
  $startDate: Date
  $endDate: Date
  $branchId: String
  $departmentId: String
  $productCategoryId: String
  $productId: String
  $jobCategoryId: String
  $jobReferId: String
`;

const listParamsValue = `
  page: $page
  perPage: $perPage
  sortField: $sortField
  sortDirection: $sortDirection
  search: $search
  startDate: $startDate
  endDate: $endDate
  branchId: $branchId
  departmentId: $departmentId
  productCategoryId: $productCategoryId
  productId: $productId
  jobCategoryId: $jobCategoryId
  jobReferId: $jobReferId
`;

const detailParamsDef = `
  $startDate: Date
  $endDate: Date
  $branchId: String
  $departmentId: String
  $productId: String
  $jobReferId: String
`;

const detailParamsValue = `
  startDate: $startDate
  endDate: $endDate
  branchId: $branchId
  departmentId: $departmentId
  productId: $productId
  jobReferId: $jobReferId
`;

export const overallWorkFields = `
  _id
  workIds
  name
  status
  inBranchId
  inDepartmentId
  outBranchId
  outDepartmentId
  count
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

export const overallWorkDetailFields = `
  ${overallWorkFields}
  startAt
  dueDate
  interval
  intervalId
  needProductsData
  resultProductsData
`;

export const performFields = `
  _id
  jobType
  jobReferId
  productId

  inBranchId
  inDepartmentId
  outBranchId
  outDepartmentId

  needProducts
  resultProducts
  needConfirmInfo
  resultConfirmInfo
  count
  status
  startAt
  endAt
  createdAt
  modifiedAt
  createdBy
  modifiedBy
`;

const overallWorks = `
  query overallWorks(${listParamsDef}) {
    overallWorks(${listParamsValue}) {
      ${overallWorkFields}
    }
  }
`;

const overallWorksCount = `
  query overallWorks(${listParamsDef}) {
    overallWorks(${listParamsValue})
  }
`;

const overallWorkDetail = `
  query overallWorkDetail(${detailParamsDef}) {
    overallWorkDetail(${detailParamsValue}) {
      ${overallWorkDetailFields}
    }
  }
`;

const performs = `
  query performs(${detailParamsDef}) {
    performs(${detailParamsValue}) {
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
  overallWorks,
  overallWorksCount,
  overallWorkDetail,
  performs,
  performsCount
};
