export const assetParamsDef = `
  $name: String,
  $type: String,
  $categoryId: String,
  $parentId: String,
  $description: String,
  $unitPrice: Float,
  $code: String,
  $order: String,
  $customFieldsData: JSON,
  $attachment: AttachmentInput,
  $attachmentMore: [AttachmentInput],
  $supply: String,
  $assetCount: Int,
  $minimiumCount: Int,
  $vendorId: String,
`;
export const assetParams = `
  name: $name,
  type: $type,
  categoryId: $categoryId,
  parentId: $parentId,
  description: $description,
  unitPrice: $unitPrice,
  code: $code,
  order: $order,
  customFieldsData: $customFieldsData,
  attachment: $attachment,
  attachmentMore: $attachmentMore,
  supply: $supply,
  assetCount: $assetCount,
  minimiumCount: $minimiumCount,
  vendorId: $vendorId,
`;

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

export const assetFields = `
  _id
  name
  type
  code
  order
  categoryId
  parentId
  vendorId
  ${vendorField}
  description
  unitPrice
  createdAt
  category {
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
  childAssetCount
  isRoot
`;

export const assetCurrentField = `
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
