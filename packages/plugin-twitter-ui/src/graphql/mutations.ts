const removeAccount = `
  mutation twitterAccountRemove($_id: String!) {
    twitterAccountRemove(_id: $_id)
  }
`;

export default {
  removeAccount
};
