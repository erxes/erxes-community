import { checkPermission, requireLogin } from '@erxes/api-utils/src/permissions';
import { afterQueryWrapper, paginate } from '@erxes/api-utils/src';
import { ASSET_STATUSES } from '../../../models/definitions/assets';
import { escapeRegExp } from '@erxes/api-utils/src/core';
import { IContext } from '../../../connectionResolver';
import messageBroker, { sendTagsMessage } from '../../../messageBroker';

const assetQueries = {
  /**
   * Assets list
   */
  async assets(
    _root,
    {
      type,
      categoryId,
      searchValue,
      tag,
      ids,
      excludeIds,
      pipelineId,
      boardId,
      ...pagintationArgs
    }: {
      ids: string[];
      excludeIds: boolean;
      type: string;
      categoryId: string;
      searchValue: string;
      tag: string;
      page: number;
      perPage: number;
      pipelineId: string;
      boardId: string;
    },
    { commonQuerySelector, models, subdomain, user }: IContext
  ) {
    const filter: any = commonQuerySelector;

    filter.status = { $ne: ASSET_STATUSES.DELETED };

    if (type) {
      filter.type = type;
    }

    if (categoryId) {
      const category = await models.AssetCategories.getAssetCatogery({
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

    if (ids && ids.length > 0) {
      filter._id = { [excludeIds ? '$nin' : '$in']: ids };
      if (!pagintationArgs.page && !pagintationArgs.perPage) {
        pagintationArgs.page = 1;
        pagintationArgs.perPage = 100;
      }
    }

    if (tag) {
      filter.tagIds = { $in: [tag] };
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
        tag,
        ids,
        excludeIds,
        pipelineId,
        boardId,
        ...pagintationArgs
      },
      await paginate(
        models.Assets.find(filter)
          .sort('code')
          .lean(),
        pagintationArgs
      ),
      messageBroker(),
      user
    );
  },

  /**
   * Get all assets count. We will use it in pager
   */
  assetsTotalCount(_root, { type }: { type: string }, { commonQuerySelector, models }: IContext) {
    const filter: any = commonQuerySelector;

    filter.status = { $ne: ASSET_STATUSES.DELETED };

    if (type) {
      filter.type = type;
    }

    return models.Assets.find(filter).countDocuments();
  },

  assetCategories(
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

    return models.AssetCategories.find(filter)
      .sort({ order: 1 })
      .lean();
  },

  assetCategoriesTotalCount(_root, _params, { models }: IContext) {
    return models.AssetCategories.find().countDocuments();
  },

  assetDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Assets.findOne({ _id }).lean();
  },

  assetCategoryDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.AssetCategories.findOne({ _id }).lean();
  },

  async assetCountByTags(_root, _params, { models, subdomain }: IContext) {
    const counts = {};

    // Count assets by tag =========
    const tags = await sendTagsMessage({
      subdomain,
      action: 'find',
      data: {
        type: 'assets:asset'
      },
      isRPC: true,
      defaultValue: []
    });

    for (const tag of tags) {
      counts[tag._id] = await models.Assets.find({
        tagIds: tag._id,
        status: { $ne: ASSET_STATUSES.DELETED }
      }).countDocuments();
    }

    return counts;
  }
};

requireLogin(assetQueries, 'assetsTotalCount');
checkPermission(assetQueries, 'assets', 'showAssets', []);
checkPermission(assetQueries, 'assetCategories', 'showAssets', []);
checkPermission(assetQueries, 'assetCountByTags', 'showAssets', []);

export default assetQueries;
