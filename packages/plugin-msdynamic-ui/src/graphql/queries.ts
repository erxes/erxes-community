const list = `
  query listQuery($typeId: String) {
    msdynamics(typeId: $typeId) {
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

const listMsdynamicTypes = `
  query listMsdynamicTypeQuery{
    msdynamicTypes{
      _id
      name
    }
  }
`;

const totalCount = `
  query msdynamicsTotalCount{
    msdynamicsTotalCount
  }
`;

export default {
  list,
  totalCount,
  listMsdynamicTypes
};
