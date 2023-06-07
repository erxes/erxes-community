const detail = `
  query instagram($conversationId: String!) {
      instagramConversationDetail(conversationId: $conversationId) {
          _id
          mailData
      }
  }
`;

const accounts = `
  query instagramAccounts {
    instagramAccounts 
  }
`;

export default {
  detail,
  accounts
};
