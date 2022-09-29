import { IContext } from '../../../connectionResolver';

const assetGroupQueries = {
  assetGroups(
    _root,
    { parentId, searchValue, status }: { parentId: string; searchValue: string; status: string },
    { commonQuerySelector, models }: IContext
  ) {
    const filter: any = commonQuerySelector;

    filter.status = { $nin: ['disabled', 'archived'] };

    if (status && status !== 'active') {
      filter.status = status;
    }

    if (parentId) {
      filter.parentId = parentId;
    }

    if (searchValue) {
      filter.name = new RegExp(`.*${searchValue}.*`, 'i');
    }

    return models.AssetGroup.find(filter)
      .sort({ order: 1 })
      .lean();
  },
  assetGroupDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.AssetGroup.findOne({ _id }).lean();
  },
  assetGroupsTotalCount(_root, _params, { models }: IContext) {
    return models.AssetGroup.find().countDocuments();
  }
};

export default assetGroupQueries;
