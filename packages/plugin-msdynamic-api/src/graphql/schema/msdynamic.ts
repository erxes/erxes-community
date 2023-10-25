const params = `
  endPoint: String
  username: String
  password: String
`;

export const queries = `
  msdynamicConfigs: [Msdynamic]
  msdynamicsTotalCount: Int
`;

export const mutations = `
  msdynamicConfigs(${params}): Msdynamic
  msdynamicEditConfigs(_id:String!, ${params}): Msdynamic
`;
