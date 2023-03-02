const list = `
  query listQuery($typeId: String) {
    kbcgws(typeId: $typeId) {
      _id
      name
      expiryDate
      createdAt
      checked
      typeId
      currentType{
        _id
        name
      }
    }
  }
`;

const listKbcgwTypes = `
  query listKbcgwTypeQuery{
    kbcgwTypes{
      _id
      name
    }
  }
`;

const totalCount = `
  query kbcgwsTotalCount{
    kbcgwsTotalCount
  }
`;

export default {
  list,
  totalCount,
  listKbcgwTypes
};
