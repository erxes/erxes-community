import { afterQueryWrapper, paginate } from '@erxes/api-utils/src';
import { escapeRegExp } from '@erxes/api-utils/src/core';
import { ASSET_STATUSES } from '../../../common/constant/asset';
import { IContext } from '../../../connectionResolver';
import messageBroker from '../../../messageBroker';

const assetQueries = {
  async assets(
    _root,
    {
      type,
      categoryId,
      parentId,
      searchValue,
      ids,
      excludeIds,
      pipelineId,
      boardId,
      ignoreIds,
      ...pagintationArgs
    }: {
      ids: string[];
      excludeIds: boolean;
      type: string;
      categoryId: string;
      parentId: string;
      searchValue: string;
      page: number;
      perPage: number;
      pipelineId: string;
      boardId: string;
      ignoreIds: string[];
    },
    { commonQuerySelector, models, subdomain, user }: IContext
  ) {
    const filter: any = commonQuerySelector;

    filter.status = { $ne: ASSET_STATUSES.DELETED };

    if (type) {
      filter.type = type;
    }

    if (ignoreIds) {
      filter._id = { $nin: ignoreIds };
    }

    if (categoryId) {
      const category = await models.AssetCategories.getAssetCategory({
        _id: categoryId,
        status: { $in: [null, 'active'] }
      });

      const asset_category_ids = await models.AssetCategories.find(
        { order: { $regex: new RegExp(category.order) } },
        { _id: 1 }
      );
      filter.categoryId = { $in: asset_category_ids };
    } else {
      const notActiveCategories = await models.AssetCategories.find({
        status: { $nin: [null, 'active'] }
      });

      filter.categoryId = { $nin: notActiveCategories.map(e => e._id) };
    }

    if (parentId) {
      filter.parentId = parentId;
    }

    if (ids && ids.length > 0) {
      filter._id = { [excludeIds ? '$nin' : '$in']: ids };
      if (!pagintationArgs.page && !pagintationArgs.perPage) {
        pagintationArgs.page = 1;
        pagintationArgs.perPage = 100;
      }
    }

    // search =========
    if (searchValue) {
      const fields = [
        {
          name: { $in: [new RegExp(`.*${escapeRegExp(searchValue)}.*`, 'i')] }
        },
        { code: { $in: [new RegExp(`.*${escapeRegExp(searchValue)}.*`, 'i')] } }
      ];

      filter.$or = fields;
    }

    return afterQueryWrapper(
      subdomain,
      'assets',
      {
        type,
        categoryId,
        searchValue,
        ids,
        excludeIds,
        pipelineId,
        boardId,
        ...pagintationArgs
      },
      await paginate(
        models.Assets.find(filter)
          .sort({ order: 1 })
          .lean(),
        pagintationArgs
      ),
      messageBroker(),
      user
    );
  },
  assetsTotalCount(_root, { type }: { type: string }, { commonQuerySelector, models }: IContext) {
    const filter: any = commonQuerySelector;

    filter.status = { $ne: ASSET_STATUSES.DELETED };

    if (type) {
      filter.type = type;
    }

    return models.Assets.find(filter).countDocuments();
  },
  assetDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Assets.findOne({ _id }).lean();
  }
};

export default assetQueries;
