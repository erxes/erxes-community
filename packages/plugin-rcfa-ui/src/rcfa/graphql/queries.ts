const rcfa = `
  query Query($mainType: String, $mainTypeId: String) {
    rcfaList(mainType: $mainType, mainTypeId: $mainTypeId)
  }
`;

export default {
  rcfa
};
