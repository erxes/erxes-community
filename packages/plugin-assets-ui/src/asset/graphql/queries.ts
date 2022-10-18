import { assetFields, assetCurrentField } from '../../common/graphql/asset';

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
