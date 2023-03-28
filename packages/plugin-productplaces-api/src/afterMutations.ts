import { getConfig } from './utils/utils';

export default {
  'cards:deal': ['update']
};

export const afterMutationHandlers = async (subdomain, params) => {
  const { type, action } = params;

  if (type === 'cards:deal') {
    if (action === 'update') {
      const deal = params.updatedDocument;
      const oldDeal = params.object;
      const destinationStageId = deal.stageId || '';

      if (!(destinationStageId && destinationStageId !== oldDeal.stageId)) {
        return;
      }

      const configs = await getConfig(subdomain, 'dealsProductsDataPlaces', {});

      // nothing
      if (!Object.keys(configs).includes(destinationStageId)) {
        return;
      }

      // create sale
      const config = {
        ...configs[destinationStageId],
        ...(await getConfig(subdomain, 'dealsProductsDataPlaces', {}))
      };

      return;
    }
    return;
  }
};
