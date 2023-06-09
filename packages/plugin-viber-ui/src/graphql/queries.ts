const detail = `
  query ViberConversationDetail($conversationId: String!) {
    viberConversationDetail(conversationId: $conversationId) {
      _id
      content
      customerId
      userId
      mailData
      createdAt
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
