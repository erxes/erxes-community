const transactions = `
  query Transactions(
    $branchId: String,
    $departmentId: String,
    $contentId: String,
    $contentType: String,
    $status: String,
    $createdAt: Date
  ) {
    transactions(
      branchId: $branchId,
      departmentId: $departmentId,
      contentId: $contentId,
      contentType: $contentType,
      status: $status,
      createdAt: $createdAt
    ) {
      _id
      branch {
        _id
        title
      }
      branchId
      department {
        _id
        title
      }
      departmentId
      contentId
      contentType
      status
      createdAt
    }
  }
`;

export default {
  transactions
};
