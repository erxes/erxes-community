const removeAccount = `
  mutation viberAccountRemove($_id: String!) {
    viberAccountRemove(_id: $_id)
  }
`;

export default {
  removeAccount
};
