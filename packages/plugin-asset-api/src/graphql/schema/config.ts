export const types = `

  type AssetsConfig {
    _id: String!
    code: String!
    value: JSON
  }
`;

export const queries = `
  assetsConfigs: [AssetsConfig]
`;

export const mutations = `
  assetsConfigsUpdate(configsMap: JSON!): JSON
`;
