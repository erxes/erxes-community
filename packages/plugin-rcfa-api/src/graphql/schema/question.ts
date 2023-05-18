export const types = `
`;

export const queries = `
  rcfaQuestions(mainType:String, mainTypeId:String): JSON
`;

export const mutations = `
  addRcfaQuestions(question:String, parentId:String, mainType:String, mainTypeId:String):JSON
  editRcfaQuestions(_id:String, question:String):JSON
  deleteRcfaQuestions(_id:String):JSON
`;
