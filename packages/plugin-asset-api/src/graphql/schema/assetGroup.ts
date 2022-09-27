import { attachmentInput, attachmentType } from '@erxes/api-utils/src/commonTypeDefs';

export const types = `

    ${attachmentType}
    ${attachmentInput}

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
`;

const assetGroupParams = `
  name: String!,
  code: String!,
  description: String,
  parentId: String,
  attachment: AttachmentInput,
  status: String
`;

export const queries = `
    assetGroup(parentId: String, searchValue: String, status: String): ListAssetGroup
    assetGroupDetail(_id: String): AssetGroup

`;

export const mutations = `
    assetGroupAdd(${assetGroupParams}): AssetGroup
    assetGroupEdit(_id: String!, ${assetGroupParams}): AssetGroup
    assetGroupRemove(_id: String!): JSON
`;
