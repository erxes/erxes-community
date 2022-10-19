export const assetCategoryParams = `
  name: String!,
  code: String!,
  description: String,
  parentId: String,
  attachment: AttachmentInput,
  status: String
`;

export const assetParams = `
  name: String,
  categoryId: String,
  parentId: String,
  type: String,
  description: String,
  sku: String,
  unitPrice: Float,
  code: String,
  order: String,
  customFieldsData: JSON,
  attachment: AttachmentInput,
  attachmentMore: [AttachmentInput],
  supply: String,
  assetCount: Int,
  minimiumCount: Int,
  vendorId: String,
`;
