const vendorField = `
  vendor {
    _id
    avatar
    businessType
    code
    createdAt
    customFieldsData
    description
    emails
    industry
    isSubscribed
    links
    location
    mergedIds
    modifiedAt
    names
    ownerId
    parentCompanyId
    phones
    plan
    primaryEmail
    primaryName
    primaryPhone
    score
    size
    tagIds
    trackedData
    website
  }
`;

const assetFields = `
  _id
  name
  type
  code
  order
  groupId
  parentId
  vendorId
  ${vendorField}
  description
  unitPrice
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
  chidlAssetCount
  isRoot
`;

const assetCurrentField = `
  currentMovement {
    branchId
    departmentId
    teamMemberId
    companyId
    customerId

    branch
    department
    teamMember
    company
    customer
  }
`;

const assets = `
  query assets(
    $type: String,
    $parentId: String,
    $groupId: String,
    $searchValue: String,
    $perPage: Int,
    $page: Int $ids: [String],
    $excludeIds: Boolean,
    $pipelineId: String,
    $boardId: String,
    $ignoreIds: [String]
  ) {
    assets(
      type: $type,
      groupId: $groupId,
      parentId: $parentId,
      searchValue: $searchValue,
      perPage: $perPage,
      page: $page ids: $ids,
      excludeIds: $excludeIds,
      pipelineId: $pipelineId,
      boardId: $boardId,
      ignoreIds: $ignoreIds
    ) {
      ${assetFields}
      ${assetCurrentField}
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
