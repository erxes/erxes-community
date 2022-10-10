import { attachmentInput, attachmentType } from '@erxes/api-utils/src/commonTypeDefs';
import { assetGroupParams } from '../../common/graphql/asset';
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

    type AssetGroup @key(fields: "_id") @cacheControl(maxAge: 3) {
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
    groupId: String
    parentId: String
    customFieldsData: JSON
    createdAt: Date
    attachment: Attachment
    attachmentMore: [Attachment]
    vendorId: String
    supply: String
    assetCount: Int
    minimiumCount: Int

    group: AssetGroup
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
      groupId: String,
      parentId: String,
      searchValue: String,
      page: Int,
      perPage: Int ids: [String],
      excludeIds: Boolean,
      pipelineId: String,
      boardId: String
    ): [Asset]
    assetsTotalCount(type: String): Int
    assetDetail(_id: String): Asset
    assetGroups(parentId: String, searchValue: String, status: String): [AssetGroup]
    assetGroupDetail(_id: String): AssetGroup
    assetGroupsTotalCount: Int

`;

export const mutations = `
    assetsAdd(${assetParams}): Asset
    assetsEdit(_id: String!, ${assetParams}): Asset
    assetsRemove(assetIds: [String!]): String
    assetsMerge(assetIds: [String], assetFields: JSON): Asset
    assetGroupAdd(${assetGroupParams}): AssetGroup
    assetGroupEdit(_id: String!, ${assetGroupParams}): AssetGroup
    assetGroupRemove(_id: String!): JSON
`;
