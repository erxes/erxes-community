import { IContext } from '../../../connectionResolver';

const assetGroupQueries = {
  assetGroup(
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

    const list = models.AssetGroup.find(filter)
      .sort({ order: 1 })
      .lean();
    const totalCount = models.AssetGroup.find(filter).countDocuments();

    return { list, totalCount };
  },
  assetGroupDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.AssetGroup.findOne({ _id }).lean();
  }
};

export default assetGroupQueries;
