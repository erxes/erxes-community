const rcfa = `
  query rcfaDetail($mainType: String, $mainTypeId: String) {
    rcfaDetail(mainType: $mainType, mainTypeId: $mainTypeId)
  }
`;

const rcfaList = `
query RcfaList($mainType: String, $searchValue: String, $page: Int, $perPage: Int) {
  rcfaList(mainType: $mainType, searchValue: $searchValue, page: $page, perPage: $perPage) {
    list {
      _id
      mainType
      mainTypeId
      relType
      relTypeId
      status
      createdAt
      createdUser
      closedAt
    }
    totalCount
  }
}
`;

export default {
  rcfa,
  rcfaList
};
