const commonParamDefs = `
  $endPoint: String
  $username: String
  $password: String
`;

const commonParams = `
  endPoint: $endPoint
  username: $username
  password: $password
`;

const addConfigs = `
  mutation msdynamicAddConfigs(${commonParamDefs}) {
    msdynamicAddConfigs(${commonParams}) {
      _id
    }
  }
`;

const editConfigs = `
  mutation msdynamicEditConfigs($_id: String!, ${commonParamDefs}){
    msdynamicEditConfigs(_id: $_id, ${commonParams}){
      _id
    }
  }
  `;

export default {
  addConfigs,
  editConfigs
};
