const getQuestions = `
  query Query($mainType: String, $mainTypeId: String) {
    rcfaQuestions(mainType: $mainType, mainTypeId: $mainTypeId)
  }
`;

export default {
  getQuestions
};
