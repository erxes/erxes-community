const detail = `
  query viber($conversationId: String!) {
      viberConversationDetail(conversationId: $conversationId) {
          _id
          mailData
      }
  }
`;

const accounts = `
  query viberAccounts {
    viberAccounts 
  }
`;

export default {
  detail,
  accounts
};
