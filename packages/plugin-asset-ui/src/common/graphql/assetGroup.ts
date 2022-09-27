export const assetGroupParamsDef = `
  $name: String!,
  $code: String!,
  $parentId: String,
  $description: String,
  $attachment: AttachmentInput,
  $status: String,
`;

export const assetGroupParams = `
  name: $name,
  code: $code,
  parentId: $parentId,
  description: $description,
  attachment: $attachment,
  status: $status,
`;
