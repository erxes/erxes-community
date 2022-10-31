const addCategory = `
mutation AuditOperationsCategoryAdd($doc: JSON) {
  auditOperationsCategoryAdd(doc: $doc)
}
`;

const removeCategory = ` 
mutation AuditOperationsCategoryRemove($id: String) {
  auditOperationsCategoryRemove(_id: $id)
}
`;

export default { addCategory, removeCategory };
