import { attachmentType } from '@erxes/api-utils/src/commonTypeDefs';

export const types = `
  ${attachmentType}
  
  type ITwitter {
    _id: String!
    title: String
    data: JSON
  }
`;

export const queries = `
  twitterConversationDetail(conversationId: String!): [ITwitter]
  twitterGetAccounts(kind: String): JSON
  twitterGetConfigs: JSON
`;

export const mutations = `
  twitterAccountRemove(_id: String!): String
  twitterUpdateConfigs(configsMap: JSON!): JSON
`;
