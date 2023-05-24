const rcfa = `
  query rcfaDetail($_id: String, $mainType: String, $mainTypeId: String) {
    rcfaDetail(_id: $_id, mainType: $mainType, mainTypeId: $mainTypeId){
    _id
    mainType
    mainTypeId
    relType
    relTypeId
    status
    createdAt
    userId
    closedAt
    issues {
      _id
      rcfaId
      issue
      createdAt
      parentId
    }
    }
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
      userId
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
