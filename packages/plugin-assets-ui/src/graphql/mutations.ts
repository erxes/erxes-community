const assetCategoryParamsDef = `
  $name: String!,
  $code: String!,
  $parentId: String,
  $description: String
`;

const assetCategoryParams = `
  name: $name,
  code: $code,
  parentId: $parentId,
  description: $description
`;

const assetsParamsDef = `
  $name: String!,
  $categoryId: String!,
  $code: String,
  $unitPrice: Int,
  $createdUser: String,
  $modifiedBy: String,
  $usedAt: String
`;

const assetsParams = `
  name: $name,
  categoryId: $categoryId,
  code: $code,
  unitPrice: $unitPrice,
  createdUser: $createdUser,
  modifiedBy: $modifiedBy,
  usedAt: $usedAt
`;

const assetsAdd = `
  mutation assetsAdd(${assetsParamsDef}) {
    assetsAdd(${assetsParams}) {
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

const assetsRemove = `
  mutation assetsDelete($assetIds: [String]) {
    assetsDelete(assetIds: $assetIds)
  }
`;

const assetsEdit = `
  mutation assetsEdit($_id: String!, ${assetsParamsDef}) {
    assetsEdit(_id: $_id, ${assetsParams}) {
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

const assetsCategoryAdd = `
  mutation  (${assetCategoryParamsDef}) {
    assetsCategoryAdd(${assetCategoryParams}) {
      _id
    }
  }
`;

const assetsCategoryRemove = `
  mutation assetsCategoryDelete($_id: String!) {
    assetsCategoryDelete(_id: $_id)
  }
`;

const assetsCategoryEdit = `
  mutation assetsCategoryEdit($_id: String!, ${assetCategoryParamsDef}) {
    assetsCategoryEdit(_id: $_id, ${assetCategoryParams}) {
      _id
    }
  }
`;

export default {
  assetsAdd,
  assetsRemove,
  assetsEdit,
  assetsCategoryAdd,
  assetsCategoryRemove,
  assetsCategoryEdit
};
