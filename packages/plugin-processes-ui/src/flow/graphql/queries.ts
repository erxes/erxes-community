export const flowFields = `
  _id
  createdAt
  createdBy
  updatedAt
  updatedBy
  name
  productId
  product
  status
  flowValidation
  jobCount
`;

const flowsQueryDefs = `
  $ids: [String]
  $categoryId: String,
  $searchValue: String,
  $branchId: String,
  $departmentId: String,
  $status: String,
  $validation: String,
`;

const flowsQueryParams = `
  ids: $ids,
  categoryId: $categoryId,
  searchValue: $searchValue,
  branchId: $branchId,
  departmentId: $departmentId,
  status: $status,
  validation: $validation,
`;

const flows = `
  query flows($page: Int, $perPage: Int, ${flowsQueryDefs}) {
    flows(page: $page, perPage: $perPage, ${flowsQueryParams}) {
      ${flowFields}
    }
  }
`;

const subFlows = `
  query flows($page: Int, $perPage: Int, ${flowsQueryDefs}) {
    flows(page: $page, perPage: $perPage, ${flowsQueryParams}) {
      ${flowFields}
      needProducts
      resultProducts
    }
  }
`;

const flowsAll = `
query flowsAll {
  flowsAll {
    ${flowFields}
  }
}
`;

const flowDetail = `
query flowDetail($_id: String!) {
  flowDetail(_id: $_id) {
    ${flowFields}
    jobs
  }
}
`;

const flowTotalCount = `
query flowTotalCount(${flowsQueryDefs}) {
  flowTotalCount(${flowsQueryParams})
}
`;

const flowCategories = `
  query flowCategories($status: String) {
    flowCategories(status: $status) {
      _id
      name
      order
      code
      parentId
      description
      status

      isRoot
      flowCount
    }
  }
`;

const flowCategoriesTotalCount = `
  query flowCategoriesTotalCount {
    flowCategoriesTotalCount
  }
`;

export default {
  flowCategories,
  flowCategoriesTotalCount,

  flows,
  subFlows,
  flowsAll,
  flowDetail,
  flowTotalCount
};
