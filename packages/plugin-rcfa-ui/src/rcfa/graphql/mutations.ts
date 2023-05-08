const commonParamDefs = `$title: String, $parentId: String!`;
const commonParams = `title: $title, parentId: $parentId`;

const add = `
  mutation addRcfaQuestions(${commonParamDefs}) {
    addRcfaQuestions(${commonParams}) {
      _id
    }
  }
`;

export default {
  add
};
