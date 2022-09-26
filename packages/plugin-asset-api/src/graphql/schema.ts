export const types = `
  type Asset {
    _id: String!
    name: String
  }
`;

export const queries = `
  Assets: [Asset]
  AssetsTotalCount: Int
`;

const params = `
  name: String!,
`;

export const mutations = `
  AssetsAdd(${params}): Asset
`;
