export const flowFields = `
  _id
  createdAt
  createdBy
  updatedAt
  updatedBy
  name
  categoryId
  productId
  product
  status
  flowValidation
`;

const flows = `
query flows($categoryId: String, $searchValue: String) {
  flows(categoryId: $categoryId, searchValue: $searchValue) {
    ${flowFields}
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
query flowTotalCount($categoryId: String, $searchValue: String) {
  flowTotalCount(categoryId: $categoryId, searchValue: $searchValue)
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
  flowsAll,
  flowDetail,
  flowTotalCount
};
