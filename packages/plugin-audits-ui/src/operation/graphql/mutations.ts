const operationAdd = `
mutation AuditOperationAdd($doc: JSON) {
    auditOperationAdd(doc: $doc)
  }
`;

export default { operationAdd };
