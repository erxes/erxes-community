export const types = `

  type RCFAIssue {
    _id:String,
    rcfaId:String,
    issue:String,
    parentId:String,
    createdAt:Date,
  }

`;

export const queries = `
  rcfaIssues(mainType:String, mainTypeId:String): [RCFAIssue]
`;

export const mutations = `
  addRcfaIssue(issue:String, parentId:String, mainType:String, mainTypeId:String):RCFAIssue
  editRcfaIssue(_id:String, issue:String):RCFAIssue
  deleteRcfaIssue(_id:String):RCFAIssue
`;
