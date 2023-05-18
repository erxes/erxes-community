const addQuestion = `
  mutation addRcfaQuestions($title: String, $parentId: String, $mainType: String, $mainTypeId: String) {
    addRcfaQuestions(title: $title, parentId: $parentId, mainType: $mainType, mainTypeId: $mainTypeId)
  }
`;

const editQuestion = `
  mutation EditRcfaQuestions($id: String, $title: String) {
    editRcfaQuestions(_id: $id, title: $title)
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
