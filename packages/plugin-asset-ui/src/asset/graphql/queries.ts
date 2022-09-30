const assetFields = `
  _id
  name
  type
  code
  order
  groupId
  parentId
  vendorId
  description
  unitPrice
  sku
  createdAt
  group {
    _id
    code
    name
  }
  parent {
    _id
    code
    name
  }
  attachment {
    url
    name
    size
    type
  }
  attachmentMore {
    url
    name
    size
    type
  }
  supply
  assetCount
  isRoot
  minimiumCount
`;
const assets = `
  query assets(
    $type: String,
    $groupId: String,
    $searchValue: String,
    $perPage: Int,
    $page: Int $ids: [String],
    $excludeIds: Boolean,
    $pipelineId: String,
    $boardId: String
  ) {
    assets(
      type: $type,
      groupId: $groupId,
      searchValue: $searchValue,
      perPage: $perPage,
      page: $page ids: $ids,
      excludeIds: $excludeIds,
      pipelineId: $pipelineId,
      boardId: $boardId
    ) {
      ${assetFields}
    }
  }
`;

const assetsCount = `
  query assetsTotalCount($type: String) {
    assetsTotalCount(type: $type)
  }
`;

const assetDetail = `
  query assetDetail($_id: String) {
    assetDetail(_id: $_id) {
      ${assetFields}
      customFieldsData
    }
  }
`;

export default { assets, assetsCount, assetDetail };
