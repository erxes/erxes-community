const removeAccount = `
  mutation telegramAccountRemove($_id: String!) {
    telegramAccountRemove(_id: $_id)
  }
`;

export default {
  removeAccount
};
