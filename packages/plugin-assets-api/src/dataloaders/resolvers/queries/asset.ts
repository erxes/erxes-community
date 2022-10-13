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
      groupId,
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
      groupId: string;
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

    if (groupId) {
      const group = await models.AssetGroup.getAssetGroup({
        _id: groupId,
        status: { $in: [null, 'active'] }
      });

      const asset_group_ids = await models.AssetGroup.find(
        { order: { $regex: new RegExp(group.order) } },
        { _id: 1 }
      );
      filter.groupId = { $in: asset_group_ids };
    } else {
      const notActiveGroups = await models.AssetGroup.find({
        status: { $nin: [null, 'active'] }
      });

      filter.groupId = { $nin: notActiveGroups.map(e => e._id) };
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
        groupId,
        searchValue,
        ids,
        excludeIds,
        pipelineId,
        boardId,
        ...pagintationArgs
      },
      await paginate(
        models.Asset.find(filter)
          .sort('code')
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

    return models.Asset.find(filter).countDocuments();
  },
  assetDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Asset.findOne({ _id }).lean();
  }
};

export default assetQueries;
