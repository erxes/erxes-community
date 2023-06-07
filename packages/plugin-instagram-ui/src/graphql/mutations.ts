const removeAccount = `
  mutation instagramAccountRemove($_id: String!) {
    instagramAccountRemove(_id: $_id)
  }
`;

export default {
  removeAccount
};
