const commonParamsDef = `
  $brandId: String!,
  $name: String!,
  $content: String,
`;

const commonParams = `
  brandId: $brandId,
  name: $name,
  content: $content,
`;

const responseTemplatesAdd = `
  mutation responseTemplatesAdd(${commonParamsDef}) {
    responseTemplatesAdd(${commonParams}) {
      _id
    }
  }
`;

const responseTemplatesEdit = `
  mutation responseTemplatesEdit($_id: String!, ${commonParamsDef}) {
    responseTemplatesEdit(_id: $_id, ${commonParams}) {
      _id
    }
  }
`;

const responseTemplatesRemove = `
  mutation responseTemplatesRemove($_id: String!) {
    responseTemplatesRemove(_id: $_id)
  }
`;

const responseTemplatesChangeStatus = `
  mutation responseTemplatesChangeStatus($_id: String!, $status: String) {
    responseTemplatesChangeStatus(_id: $_id, status: $status) {
      _id
    }
  }
`;

export default {
  responseTemplatesAdd,
  responseTemplatesEdit,
  responseTemplatesRemove,
  responseTemplatesChangeStatus
};
