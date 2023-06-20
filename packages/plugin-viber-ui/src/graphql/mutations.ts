const removeAccount: string = `
  mutation viberAccountRemove($_id: String!) {
    viberAccountRemove(_id: $_id)
  }
`;

const viberIntegrationUpdate: string = `
  mutation viberIntegrationUpdate($update: UpdateInput) {
    viberIntegrationUpdate(update: $update)
  }
`;

export default {
  removeAccount,
  viberIntegrationUpdate
};
