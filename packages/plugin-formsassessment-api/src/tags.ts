import { generateModels } from './connectionResolver';

export default {
  types: [
    {
      description: 'Risk Assessments',
      type: 'riskassessment'
    }
  ],
  tag: async ({ subdomain, data }) => {
    const { action, _ids, targetIds, tagIds } = data;

    const models = await generateModels(subdomain);

    let response = {};

    if (action === 'count') {
      const itemsCount = await models.Items.countDocuments({
        tagIds: { $in: _ids }
      });
      const groupsCount = await models.ItemsGroups.countDocuments({
        tagIds: { $in: _ids }
      });

      response = itemsCount + groupsCount;
    }

    if (action === 'tagObject') {
      await models.ItemsGroups.updateMany(
        { _id: { $in: targetIds } },
        { $set: { tagIds } },
        { multi: true }
      );
      await models.Items.updateMany(
        { _id: { $in: targetIds } },
        { $set: { tagIds } },
        { multi: true }
      );

      const items = await models.Items.find({
        _id: { $in: targetIds }
      }).lean();
      const groups = await models.ItemsGroups.find({
        _id: { $in: targetIds }
      }).lean();

      response = [...items, ...groups];
    }

    return response;
  },
  fixRelatedItems: async ({
    subdomain,
    data: { sourceId, destId, action }
  }) => {
    const models = await generateModels(subdomain);

    if (action === 'remove') {
      await models.Items.updateMany(
        { tagIds: { $in: [sourceId] } },
        { $pull: { tagIds: { $in: [sourceId] } } }
      );
      await models.ItemsGroups.updateMany(
        { tagIds: { $in: [sourceId] } },
        { $pull: { tagIds: { $in: [sourceId] } } }
      );
    }

    if (action === 'merge') {
      const itemIds = await models.Items.find(
        { tagIds: { $in: [sourceId] } },
        { _id: 1 }
      ).distinct('_id');
      const groupIds = await models.ItemsGroups.find(
        { tagIds: { $in: [sourceId] } },
        { _id: 1 }
      ).distinct('_id');

      await models.Items.updateMany(
        {
          _id: { $in: itemIds }
        },
        {
          $set: { 'tagIds.$[elem]': destId }
        },
        {
          arrayFilters: [{ elem: { $eq: sourceId } }]
        }
      );
      await models.ItemsGroups.updateMany(
        {
          _id: { $in: groupIds }
        },
        {
          $set: { 'tagIds.$[elem]': destId }
        },
        {
          arrayFilters: [{ elem: { $eq: sourceId } }]
        }
      );
    }
  }
};
