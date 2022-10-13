import { assetGroupParamsDef, assetGroupParams } from '../../../common/graphql/assetGroup';

const assetGroupAdd = `
  mutation assetGroupAdd(${assetGroupParamsDef}) {
    assetGroupAdd(${assetGroupParams}) {
      _id
    }
  }
`;

const assetGroupEdit = `
  mutation assetGroupEdit($_id: String!, ${assetGroupParamsDef}) {
    assetGroupEdit(_id: $_id, ${assetGroupParams}) {
      _id
    }
  }
`;
const assetGroupRemove = `
  mutation assetGroupRemove($_id: String!) {
    assetGroupRemove(_id: $_id)
  }
`;

export default { assetGroupAdd, assetGroupEdit, assetGroupRemove };
