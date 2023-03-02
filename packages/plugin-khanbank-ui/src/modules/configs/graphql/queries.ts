const listQuery = `
query KhanbankConfigsList($page: Int, $perPage: Int) {
    khanbankConfigsList(page: $page, perPage: $perPage) {
      list {
        _id
        departmentIds
        departments {
          _id
          title
        }
        consumerKey
        secretKey
        description
        name
        userIds
        users {
          _id
          details {
            avatar
            fullName
            firstName
            lastName
            shortName
          }
        }
      }
      totalCount
    }
  }
`;

export default {
  listQuery
};
