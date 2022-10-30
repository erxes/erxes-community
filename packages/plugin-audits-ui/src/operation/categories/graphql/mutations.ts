const operationAdd = `
mutation AuditOperationCategoryAdd($doc: JSON) {
  auditOperationCategoryAdd(doc: $doc)
}
`;

export default { operationAdd };
