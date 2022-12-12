import { assetParams, assetParamsDef } from '../../common/graphql/asset';

const assetAdd = `
  mutation assetsAdd(${assetParamsDef}) {
    assetsAdd(${assetParams}) {
      _id
    }
  }
`;

const assetEdit = `
  mutation assetsEdit($_id: String!, ${assetParamsDef}) {
    assetsEdit(_id: $_id, ${assetParams}) {
      _id
    }
  }
`;

const assetsMerge = `
  mutation assetsMerge($assetIds: [String], $assetFields: JSON) {
    assetsMerge(assetIds: $assetIds, assetFields: $assetFields) {
      _id
    }
  }
`;

const assetsRemove = `
  mutation assetsRemove($assetIds: [String!]) {
    assetsRemove(assetIds: $assetIds)
  }
`;

const addKnowledgeBase = `
  mutation AddAssetdKnowledgeBase($assetId: String, $knowledgeBaseData: KnowledgeBaseType) {
  addAssetdKnowledgeBase(assetId: $assetId, knowledgeBaseData: $knowledgeBaseData)
}
`;

const updateKnowledgeBase = `
  mutation UpdateAssetdKnowledgeBase($assetId: String, $knowledgeBaseData: KnowledgeBaseType) {
  updateAssetdKnowledgeBase(assetId: $assetId, knowledgeBaseData: $knowledgeBaseData)
}
`;

const removeKnowledgeBase = `
  mutation RemoveAssetdKnowledgeBase($assetId: String, $knowledgeBaseId: String) {
  removeAssetdKnowledgeBase(assetId: $assetId, knowledgeBaseId: $knowledgeBaseId)
}
`;

export default {
  assetAdd,
  assetEdit,
  assetsRemove,
  assetsMerge,
  addKnowledgeBase,
  updateKnowledgeBase,
  removeKnowledgeBase
};
