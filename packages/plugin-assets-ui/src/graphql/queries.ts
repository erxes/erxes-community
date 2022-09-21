const list = `
  query assetsQuery {
    assets {
      _id
      name
    }
  }
`;

const totalCount = `
  query assetsTotalCountQuery {
    assetsTotalCount
  }
`;

const assetsCategories = `
  query assetsCategories($parentId: String, $searchValue: String) {
    assetsCategories(parentId: $parentId, searchValue: $searchValue) {
      _id
    name
    parentId
    tangible
    intagible
    description
    code
    order

    isRoot
    }
}
`;

const assets = `
  query assets {
    assets {
      _id
      name
      categoryId
      code
      unitPrice
      createdAt
      modifiedAt
      createdUser
      modifiedBy
      usedAt
    }
}
`;

export const assetsDetail = `
query assetsDetail($_id: String!) {
  assetsDetail(_id: $_id) {
    _id
    name
    categoryId
    code
    unitPrice
    createdAt
    modifiedAt
    createdUser
    modifiedBy
    usedAt
  }
}
`;

export default {
  list,
  totalCount,
  assetsCategories,
  assets,
  assetsDetail
};
