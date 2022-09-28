import { isEnabled } from '@erxes/ui/src/utils/core';

const assetFields = `
  _id
  name
  type
  code
  groupId
  vendorId
  description
  unitPrice
  sku
  ${
    isEnabled('tags')
      ? `
    getTags {
      _id
      name
      colorCode
    }
    `
      : ``
  }
  tagIds
  createdAt
  group {
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
  minimiumCount
`;
const assets = `
  query assets(
    $type: String,
    $groupId: String,
    $tag: String,
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
      tag: $tag,
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

export default { assets, assetsCount };
