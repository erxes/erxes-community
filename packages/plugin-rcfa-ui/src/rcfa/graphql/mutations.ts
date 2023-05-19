const addQuestion = `
  mutation AddRcfaQuestions($question: String, $parentId: String, $mainType: String, $mainTypeId: String) {
    addRcfaQuestions(question: $question, parentId: $parentId, mainType: $mainType, mainTypeId: $mainTypeId)
  }
`;

const editQuestion = `
  mutation EditRcfaQuestions($id: String, $question: String) {
    editRcfaQuestions(_id: $id, question: $question)
  }
`;

const deleteQuestion = `
  mutation DeleteRcfaQuestions($id: String) {
    deleteRcfaQuestions(_id: $id)
  }
`;

const rcfaCreateRelatedTask = `
  mutation RcfaCreateRelatedTask($type: String, $sourceType: String, $itemId: String, $name: String, $stageId: String) {
    rcfaCreateRelatedTask(type: $type, sourceType: $sourceType, itemId: $itemId, name: $name, stageId: $stageId)
  }
`;

export default {
  addQuestion,
  editQuestion,
  deleteQuestion,
  rcfaCreateRelatedTask
};
