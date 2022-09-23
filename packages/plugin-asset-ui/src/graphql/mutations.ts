const commonParamDefs = `$name: String!`;
const commonParams = `name: $name`;

const add = `
  mutation assetsAdd(${commonParamDefs}) {
    assetsAdd(${commonParams}) {
      _id
    }
  }
`;

export default {
  add
};
