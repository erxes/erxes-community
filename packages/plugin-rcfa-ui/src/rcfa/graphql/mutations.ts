const commonParamDefs = `$title: String, $mainType: String, $mainTypeId: String`;
const commonParams = `title: $title, mainType: $mainType, mainTypeId: $mainTypeId`;

const addQuestion = `
  mutation addRcfaQuestions(${commonParamDefs}) {
    addRcfaQuestions(${commonParams})
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

export default {
  addQuestion,
  editQuestion,
  deleteQuestion
};
