const documents = `
  query documents($page: Int, $perPage: Int) {
    documents(page: $page, perPage: $perPage) {
      _id
      contentType
      name
      content
    }
  }
`;

const totalCount = `
  query documentsTotalCount {
    documentsTotalCount
  }
`;

export default {
  documents,
  totalCount
};
