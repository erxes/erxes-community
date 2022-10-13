const assetGroup = `
  query assetGroups($status: String) {
    assetGroups(status: $status) {
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

const assetGroupsTotalCount = `
  query assetGroupsTotalCount {
    assetGroupsTotalCount
  }
`;

export default { assetGroup, assetGroupDetail, assetGroupsTotalCount };
