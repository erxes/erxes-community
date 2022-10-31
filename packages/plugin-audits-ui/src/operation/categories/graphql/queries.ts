const operationCategories = `
    query OperationsCategories {
  auditOperationsCategories
  auditOperationsCategoriesTotalCount
}
`;

const operationCategory = `
query OperationsCategory($_id: String) {
  auditOperationsCategory(_id: $_id)
}
`;

export default { operationCategories, operationCategory };
