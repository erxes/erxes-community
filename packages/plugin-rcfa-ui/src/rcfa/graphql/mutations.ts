const commonTypes = `
    _id
    rcfaId
    issue
    parentId
    createdAt
`;

const addIssue = `
mutation AddRcfaIssue($issue: String, $mainType: String, $mainTypeId: String) {
  addRcfaIssue(issue: $issue, mainType: $mainType, mainTypeId: $mainTypeId) { ${commonTypes} }
}
`;

const editIssue = `
mutation EditRcfaIssue($_id: String, $issue: String) {
  editRcfaIssue(_id: $_id, issue: $issue) { ${commonTypes} }
}
`;

const removeIssue = `
  mutation DeleteRcfaIssue($_id: String) {
    deleteRcfaIssue(_id: $_id) { ${commonTypes} }
  }
`;

const resolveRCFA = `
mutation ResolveRCFA($mainType: String, $mainTypeId: String, $destinationType: String, $destinationStageId: String) {
  resolveRCFA(mainType: $mainType, mainTypeId: $mainTypeId, destinationType: $destinationType, destinationStageId: $destinationStageId) {
    _id
    mainType
    mainTypeId
    relType
    relTypeId
    status
    createdAt
    userId
    closedAt
  }
}
`;

export default {
  addIssue,
  editIssue,
  removeIssue,
  resolveRCFA
};
