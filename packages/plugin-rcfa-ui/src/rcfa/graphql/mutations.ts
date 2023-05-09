const commonParamDefs = `$title: String, $mainType: String, $mainTypeId: String`;
const commonParams = `title: $title, mainType: $mainType, mainTypeId: $mainTypeId`;

const add = `
  mutation addRcfaQuestions(${commonParamDefs}) {
    addRcfaQuestions(${commonParams})
  }
`;

export default {
  add
};
