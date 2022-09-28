import { attachmentInput, attachmentType } from '@erxes/api-utils/src/commonTypeDefs';
import { assetGroupParams } from '../../common/graphql/asset';
import { assetParams } from '../../common/graphql/asset';

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

    type ListAssetGroup {
        list :[AssetGroup]
        totalCount: Int
    }

    type Asset @key(fields: "_id") @cacheControl(maxAge: 3) {
    _id: String!
    name: String
    code: String
    type: String
    description: String
    sku: String
    unitPrice: Float
    groupId: String
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

    group: AssetGroup
    ${contactsAvailable ? 'vendor: Company' : ''}
    }

`;

export const queries = `
    assets(
      type: String,
      groupId: String,
      searchValue: String,
      tag: String,
      page: Int,
      perPage: Int ids: [String],
      excludeIds: Boolean,
      pipelineId: String,
      boardId: String
    ): [Asset]
    assetsTotalCount(type: String): Int
    assetGroup(parentId: String, searchValue: String, status: String): ListAssetGroup
    assetGroupDetail(_id: String): AssetGroup

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
