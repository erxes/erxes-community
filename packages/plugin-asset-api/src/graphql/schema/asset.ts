import { attachmentInput, attachmentType } from '@erxes/api-utils/src/commonTypeDefs';

export const types = (tagsAvailable, contactsAvailable) => `
  ${attachmentType}
  ${attachmentInput}

  ${
    tagsAvailable
      ? `
      extend type Tag @key(fields: "_id") {
        _id: String! @external
      }
    `
      : ''
  }

  ${
    contactsAvailable
      ? `
      extend type Company @key(fields: "_id") {
        _id: String! @external
      }
    `
      : ''
  }

  type AssetCategory @key(fields: "_id") @cacheControl(maxAge: 3) {
    _id: String!
    name: String
    description: String
    parentId: String
    code: String!
    order: String!
    attachment: Attachment
    status: String
    isRoot: Boolean
    assetCount: Int
  }

  type Asset @key(fields: "_id") @cacheControl(maxAge: 3) {
    _id: String!
    name: String
    code: String
    type: String
    description: String
    sku: String
    unitPrice: Float
    categoryId: String
    customFieldsData: JSON
    createdAt: Date
    ${tagsAvailable ? `getTags: [Tag]` : ''}
    tagIds: [String]
    attachment: Attachment
    attachmentMore: [Attachment]
    vendorId: String
    supply: String
    assetCount: Int
    minimiumCount: Int
    uomId: String
    subUoms: JSON

    uom: Uom
    category: AssetCategory
    ${contactsAvailable ? 'vendor: Company' : ''}
  }
`;

const assetParams = `
  name: String,
  categoryId: String,
  type: String,
  description: String,
  sku: String,
  unitPrice: Float,
  code: String,
  customFieldsData: JSON,
  attachment: AttachmentInput,
  attachmentMore: [AttachmentInput],
  supply: String,
  assetCount: Int,
  minimiumCount: Int,
  vendorId: String,

  uomId: String,
  subUoms: JSON
`;

const assetCategoryParams = `
  name: String!,
  code: String!,
  description: String,
  parentId: String,
  attachment: AttachmentInput,
  status: String
`;

export const queries = `
  assetCategories(parentId: String, searchValue: String, status: String): [AssetCategory]
  assetCategoriesTotalCount: Int
  assetCategoryDetail(_id: String): AssetCategory

  assets(
    type: String,
    categoryId: String,
    searchValue: String,
    tag: String,
    page: Int,
    perPage: Int ids: [String],
    excludeIds: Boolean,
    pipelineId: String,
    boardId: String
  ): [Asset]
  assetsTotalCount(type: String): Int
  assetDetail(_id: String): Asset
  assetCountByTags: JSON
`;

export const mutations = `
  assetsAdd(${assetParams}): Asset
  assetsEdit(_id: String!, ${assetParams}): Asset
  assetsRemove(assetIds: [String!]): String
  assetsMerge(assetIds: [String], assetFields: JSON): Asset
  assetCategoriesAdd(${assetCategoryParams}): AssetCategory
  assetCategoriesEdit(_id: String!, ${assetCategoryParams}): AssetCategory
  assetCategoriesRemove(_id: String!): JSON
`;
