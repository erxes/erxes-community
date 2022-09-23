const list = `
  query assetsQuery {
    assets {
      _id
      name
    }
  }
`;

const totalCount = `
  query assetsTotalCountQuery {
    assetsTotalCount
  }
`;

export default {
  list,
  totalCount
};
