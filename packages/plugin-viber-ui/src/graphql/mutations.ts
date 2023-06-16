const removeAccount = `
  mutation viberAccountRemove($_id: String!) {
    viberAccountRemove(_id: $_id)
  }
`;

const viberIntegrationUpdate = `
  mutation viberIntegrationUpdate($update: UpdateInput) {
    viberIntegrationUpdate(update: $update)
  }
`;

export default {
  removeAccount,
  viberIntegrationUpdate
};
