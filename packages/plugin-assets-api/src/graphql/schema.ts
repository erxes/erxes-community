export const types = `
  type Assets {
    _id: String!
    name: String
    categoryId: String
    code: String
    unitPrice: Int
    createdAt: Date
    modifiedAt: Date
    createdUser: String
    modifiedBy: String
    usedAt: Date
  }

  type AssetsCategory {
    _id: String!
    name: String
    parentId: String
    tangible: String
    intagible: String
    description: String
    code: String!
    order: String!

    isRoot: Boolean
  }
`;

export const queries = `
  assetsCategories(parentId: String, searchValue: String): [AssetsCategory]
  assetsCategoriesTotalCount: Int
  assets: [Assets]
  assetsTotalCount: Int
  assetsDetail(_id: String): Assets

`;

const params = `
  name: String!,
  categoryId: String!,
  code: String,
  unitPrice: Int,
  createdAt: String,
  modifiedAt: String,
  createdUser: String,
  modifiedBy: String,
  usedAt: String,
`;

const categoryparams = `
  description: String
  name: String!
  parentId: String
  intagible: String
  tangible: String
  code: String!
`;

export const mutations = `
  assetsAdd(${params}): Assets
  assetsCategoryAdd(${categoryparams}): AssetsCategory
  assetsEdit(_id: String! ${params}): Assets
  assetsCategoryEdit(_id: String!, ${categoryparams}): AssetsCategory
  assetsDelete(assetIds: [String]): JSON
  assetsCategoryDelete(_id: String!): JSON
`;
