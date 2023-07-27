const accountFields = `
  _id
  name
  type
  code
  journal
  currency
  categoryId
  isBalance,
  closePercent,
  createdAt
  category {
    _id
    code
    status
    name
  }
  accountCount
`;

const accounts = `
  query accounts(
    $type: String,
    $categoryId: String,
    $searchValue: String,
    $perPage: Int,
    $page: Int $ids: [String],
    $excludeIds: Boolean,
    $pipelineId: String,
    $boardId: String,
    $segment: String,
    $segmentData: String
  ) {
    accounts(
      type: $type,
      categoryId: $categoryId,
      searchValue: $searchValue,
      perPage: $perPage,
      page: $page ids: $ids,
      excludeIds: $excludeIds,
      pipelineId: $pipelineId,
      boardId: $boardId,
      segment: $segment,
      segmentData: $segmentData
    ) {
      ${accountFields}
    }
  }
`;
const accountCategories = `
  query accountCategories($status: String) {
    accountCategories(status: $status) {
      _id
      name
      order
      code
      parentId
      status
      isRoot
      accountCount
    }
  }
`;

const accountCategoriesCount = `
  query accountCategoriesTotalCount {
    accountCategoriesTotalCount
  }
`;

const accountsGroupCounts = `
  query accountsGroupCounts(
    $segment: String,
    $segmentData: String,
    $only: String
  ) {
    accountsGroupCounts(
      segment: $segment,
      segmentData: $segmentData,
      only: $only
    )
  }
`;

const accountsCount = `
  query accountsTotalCount($type: String, $segment: String, $segmentData: String) {
    accountsTotalCount(type: $type, segment: $segment, segmentData: $segmentData)
  }
`;

const accountCategoryDetail = `
  query accountCategoryDetail($_id: String) {
    accountCategoryDetail(_id: $_id) {
      _id
      name
      accountCount
    }
  }
`;

// account documents
const documents = `
  query documents($page: Int, $perPage: Int, $contentType: String) {
    documents(page: $page, perPage: $perPage, contentType: $contentType) {
      _id
      contentType
      name
      createdAt
    }
  }
`;
const accountDetail = `
  query accountDetail($_id: String) {
    accountDetail(_id: $_id) {
      ${accountFields}
      customFieldsData
    }
  }
`;
export default {
  accounts,
  accountDetail,
  accountsCount,
  accountsGroupCounts,
  accountCategories,
  accountCategoriesCount,
  accountCategoryDetail,
  documents
};
