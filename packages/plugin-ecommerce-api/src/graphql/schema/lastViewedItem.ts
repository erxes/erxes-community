export const types = `
  type LastViewedItem {
    _id: String!
    productId: String!
    customerId : String!
  }
`;

const mutationParams = `
    productId: String!,
    customerId : String!,
`;

export const queries = `
  lastViewedItems(customerId: String!): [LastViewedItem]
`;

export const mutations = `
  lastViewedItemAdd(${mutationParams}): LastViewedItem
  lastViewedItemRemove(_id: String!): LastViewedItem
`;
