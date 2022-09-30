import { mutations as assetMutations } from '@erxes/ui-assets/src/graphql';

const assetAdd = assetMutations.assetAdd;

const assetEdit = assetMutations.assetEdit;

const assetsRemove = assetMutations.assetsRemove;

const assetCategoryAdd = assetMutations.assetCategoryAdd;
const assetCategoryEdit = assetMutations.assetCategoryEdit;

const assetCategoryRemove = `
  mutation assetCategoriesRemove($_id: String!) {
    assetCategoriesRemove(_id: $_id)
  }
`;

const assetsMerge = `
  mutation assetsMerge($assetIds: [String], $assetFields: JSON) {
    assetsMerge(assetIds: $assetIds, assetFields: $assetFields) {
      _id
    }
  }
`;

// UOM

const uomsAdd = `
  mutation uomsAdd($name: String, $code: String) {
    uomsAdd(name: $name, code: $code) {
      _id
      name
      code
      createdAt
    }
  }
`;

const uomsEdit = `
  mutation uomsEdit($id: String!, $name: String, $code: String) {
    uomsEdit(_id: $id, name: $name, code: $code) {
      _id
      name
      code
      createdAt
    }
  }
`;

const uomsRemove = `
  mutation uomsRemove($uomIds: [String!]) {
    uomsRemove(uomIds: $uomIds)
  }
`;

// Settings

const assetsConfigsUpdate = assetMutations.assetsConfigsUpdate;

export default {
  assetAdd,
  assetEdit,
  assetsRemove,
  assetCategoryAdd,
  assetCategoryEdit,
  assetCategoryRemove,
  assetsMerge,

  uomsAdd,
  uomsEdit,
  uomsRemove,

  assetsConfigsUpdate
};
