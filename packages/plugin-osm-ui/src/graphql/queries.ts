const list = `
  query listQuery($typeId: String) {
    osms(typeId: $typeId) {
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

const listOsmTypes = `
  query listOsmTypeQuery{
    osmTypes{
      _id
      name
    }
  }
`;

const totalCount = `
  query osmsTotalCount{
    osmsTotalCount
  }
`;

export default {
  list,
  totalCount,
  listOsmTypes
};
