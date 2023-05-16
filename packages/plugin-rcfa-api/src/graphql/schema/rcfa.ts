export const types = `
`;

export const queries = `
  rcfaQuestions(mainType:String, mainTypeId:String): JSON
`;

export const mutations = `
    addRcfaQuestions(title:String, mainType:String, mainTypeId:String):JSON
    editRcfaQuestions(_id:String, title:String):JSON
    deleteRcfaQuestions(_id:String):JSON
    rcfaCreateRelatedTask(type:String, sourceType:String, itemId:String, name:String, stageId:String):JSON
`;
