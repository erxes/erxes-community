const assetGroup = `
  query assetGroup($status: String) {
    assetGroup(status: $status) {
      list {

        _id
        name
        order
        code
        parentId
      description
      status
      attachment {
        name
        url
        type
        size
      }
      
      isRoot
      assetCount
    }
    totalCount
    }
  }
`;

const assetGroupDetail = `
  query assetGroupDetail($_id: String) {
    assetGroupDetail(_id: $_id) {
      _id
      name
      assetCount
    }
  }
`;

export default { assetGroup, assetGroupDetail };
