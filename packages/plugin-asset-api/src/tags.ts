import { generateModels } from './connectionResolver';

export default {
  types: [
    {
      description: 'Asset & Service',
      type: 'asset'
    }
  ],

  tag: async ({ subdomain, data }) => {
    const { action, _ids, targetIds, tagIds } = data;
    const models = await generateModels(subdomain);

    let response = {};

    if (action === 'count') {
      response = await models.Assets.countDocuments({
        tagIds: { $in: _ids }
      });
    }

    if (action === 'tagObject') {
      await models.Assets.updateMany(
        { _id: { $in: targetIds } },
        { $set: { tagIds } },
        { multi: true }
      );

      response = await models.Assets.find({ _id: { $in: targetIds } }).lean();
    }

    return response;
  },
  fixRelatedItems: async ({ subdomain, data: { sourceId, destId, action } }) => {
    const models = await generateModels(subdomain);

    if (action === 'remove') {
      await models.Assets.updateMany(
        { tagIds: { $in: [sourceId] } },
        { $pull: { tagIds: { $in: [sourceId] } } }
      );
    }

    if (action === 'merge') {
      const itemIds = await models.Assets.find(
        { tagIds: { $in: [sourceId] } },
        { _id: 1 }
      ).distinct('_id');

      // add to new destination
      await models.Assets.updateMany(
        { _id: { $in: itemIds } },
        { $set: { 'tagIds.$[elem]': destId } },
        { arrayFilters: [{ elem: { $eq: sourceId } }] }
      );
    }
  }
};
