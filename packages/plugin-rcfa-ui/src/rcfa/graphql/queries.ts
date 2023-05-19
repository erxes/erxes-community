const rcfa = `
  query rcfaList {
    rcfaList
  }
  query rcfaDetail($mainType: String, $mainTypeId: String) {
    rcfaDetail(mainType: $mainType, mainTypeId: $mainTypeId)
  }
`;

const rcfaList = `
  query rcfaList {
    rcfaList
  }
`;

export default {
  rcfa,
  rcfaList
};
