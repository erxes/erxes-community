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

const listParamsDef = `
  $search: String
  $startDate: Date
  $endDate: Date
  $inBranchId: String
  $outBranchId: String
  $inDepartmentId: String
  $outDepartmentId: String
  $productCategoryId: String
  $productId: String
  $jobCategoryId: String
  $jobReferId: String
`;

const listParamsValue = `
  search: $search
  startDate: $startDate
  endDate: $endDate
  inBranchId: $inBranchId
  outBranchId: $outBranchId
  inDepartmentId: $inDepartmentId
  outDepartmentId: $outDepartmentId
  productCategoryId: $productCategoryId
  productId: $productId
  jobCategoryId: $jobCategoryId
  jobReferId: $jobReferId
`;

const detailParamsDef = `
  $startDate: Date
  $endDate: Date
  $inBranchId: String
  $outBranchId: String
  $inDepartmentId: String
  $outDepartmentId: String
  $productId: String
  $jobReferId: String
`;

const detailParamsValue = `
  startDate: $startDate
  endDate: $endDate
  inBranchId: $inBranchId
  outBranchId: $outBranchId
  inDepartmentId: $inDepartmentId
  outDepartmentId: $outDepartmentId
  productId: $productId
  jobReferId: $jobReferId
`;

export const overallWorkFields = `
  _id {
    inBranchId
    inDepartmentId
    outBranchId
    outDepartmentId
    type
    typeId
  }
  type
  workIds
  name
  status
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
  query overallWorks(${listParamsDef}, ${paginateDefs}) {
    overallWorks(${listParamsValue}, ${paginateParams}) {
      ${overallWorkFields}
    }
  }
`;

const overallWorksCount = `
  query overallWorksCount(${listParamsDef}) {
    overallWorksCount(${listParamsValue})
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
