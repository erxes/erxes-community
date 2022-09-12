// Settings

const updateConfigs = `
  mutation configsUpdate($configsMap: JSON!) {
    configsUpdate(configsMap: $configsMap)
  }
`;

const toCheckSynced = `
  mutation toCheckSynced($ids: [String]) {
    toCheckSynced(ids: $ids) {
      _id
      isSynced
      syncedDate
      syncedBillNumber
    }
  }
`;

const toSyncDeals = `
  mutation toSyncDeals($dealIds: [String]) {
    toSyncDeals(dealIds: $dealIds)
  }
`;

const toSyncOrders = `
  mutation toSyncOrders($orderIds: [String]) {
    toSyncOrders(orderIds: $orderIds)
  }
`;

const toSyncProducts = `
  mutation toSyncProducts($productCodes: [String], $productIds: [String], $operation: String) {
    toSyncOrders(productCodes: $productCodes, productIds: $productIds, operation: $operation)
  }
`;

const toSyncCategories = `
  mutation toSyncCategories($categoryCodes: [String], $categoryIds: [String], $operation: String) {
    toSyncCategories(categoryCodes: $categoryCodes, categoryIds: $categoryIds, operation: $operation)
  }
`;

export default {
  updateConfigs,
  toCheckSynced,
  toSyncDeals,
  toSyncOrders,
  toSyncCategories,
  toSyncProducts
};
