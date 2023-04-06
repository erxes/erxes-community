import { models } from '../../../connectionResolver';
const lastViewedItemQueries = {
  lastViewedItems: async (_root, params) => {
    const { customerId } = params;
    return models?.LastViewedItem.getLastViewedItems(customerId);
  }
};
export default lastViewedItemQueries;
