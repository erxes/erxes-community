const detail = `
  query telegram($conversationId: String!) {
      telegramConversationDetail(conversationId: $conversationId) {
          _id
          mailData
      }
  }
`;

const accounts = `
  query telegramAccounts {
    telegramAccounts 
  }
`;

export default {
  detail,
  accounts
};
