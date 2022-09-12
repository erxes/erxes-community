export const mutations = `
  toCheckSynced(ids: [String]): [CheckResponse]
  toSyncDeals(dealIds: [String]): JSON
  toSyncOrders(orderIds: [String]): JSON
  toSyncProducts(productCodes: [String], productIds: [String]): JSON
  toSyncCategories(categoryCodes: [String], categoryIds: [String]): JSON
`;
