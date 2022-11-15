const discounts = `
  query discounts($status: String) {
    discounts(status: $status) {
      _id
      name
      status
      createdAt
      createdBy
      updatedAt
      updatedBy
      createdUser {
        details {
          fullName
        }
      }
      updatedUser {
        details {
          fullName
        }
      }
    }
  }
`;

export default {
  discounts
};
