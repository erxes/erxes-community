const addMutation = `
mutation KhanbankConfigsAdd($consumerKey: String!, $name: String!, $secretKey: String!, $departmentIds: [String], $description: String, $userIds: [String]) {
    khanbankConfigsAdd(consumerKey: $consumerKey, name: $name, secretKey: $secretKey, departmentIds: $departmentIds, description: $description, userIds: $userIds) {
      _id
    }
  }
`;

const editMutation = `
mutation KhanbankConfigsEdit($_id: String!, $consumerKey: String!, $name: String!, $secretKey: String!, $departmentIds: [String], $description: String, $userIds: [String]) {
    khanbankConfigsEdit(_id: $_id, consumerKey: $consumerKey, name: $name, secretKey: $secretKey, departmentIds: $departmentIds, description: $description, userIds: $userIds) {
        _id
    }
}
`;

const removeMutation = `
mutation KhanbankConfigsRemove($id: [String]) {
    khanbankConfigsRemove(_id: $id)
  }
`;

export default {
  addMutation,
  editMutation,
  removeMutation
};
