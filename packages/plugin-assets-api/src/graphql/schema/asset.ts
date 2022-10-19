import { attachmentInput, attachmentType } from '@erxes/api-utils/src/commonTypeDefs';
import { assetCategoryParams } from '../../common/graphql/asset';
import { assetParams } from '../../common/graphql/asset';

export const types = contactsAvailable => `

    ${attachmentType}
    ${attachmentInput}
    
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
    type CurrentMovement {
      branchId: String
      departmentId: String
      teamMemberId: String
      companyId: String
      customerId: String

      branch:JSON
      department:JSON
      teamMember:JSON
      company:JSON
      customer:JSON
    }

    type Asset @key(fields: "_id") @cacheControl(maxAge: 3) {
    _id: String!
    name: String
    code: String
    order: String
    type: String
    description: String
    sku: String
    unitPrice: Float
    categoryId: String
    parentId: String
    customFieldsData: JSON
    createdAt: Date
    attachment: Attachment
    attachmentMore: [Attachment]
    vendorId: String
    supply: String
    assetCount: Int
    minimiumCount: Int

    category: AssetCategory
    parent:Asset
    isRoot: Boolean
    chidlAssetCount:Int
    currentMovement:CurrentMovement
    ${contactsAvailable ? 'vendor: Company' : ''}
    }

`;

export const queries = `
    assets(
      type: String,
      categoryId: String,
      parentId: String,
      searchValue: String,
      page: Int,
      perPage: Int ids: [String],
      excludeIds: Boolean,
      pipelineId: String,
      boardId: String,
      ignoreIds:[String]
    ): [Asset]
    assetsTotalCount(type: String): Int
    assetDetail(_id: String): Asset
    assetCategories(parentId: String, searchValue: String, status: String): [AssetCategory]
    assetCategoryDetail(_id: String): AssetCategory
    assetCategoriesTotalCount: Int

`;

export const mutations = `
    assetsAdd(${assetParams}): Asset
    assetsEdit(_id: String!, ${assetParams}): Asset
    assetsRemove(assetIds: [String!]): String
    assetsMerge(assetIds: [String], assetFields: JSON): Asset
    assetCategoryAdd(${assetCategoryParams}): AssetCategory
    assetCategoryEdit(_id: String!, ${assetCategoryParams}): AssetCategory
    assetCategoryRemove(_id: String!): JSON
`;
