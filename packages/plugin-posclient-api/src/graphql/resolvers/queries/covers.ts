import { paginate } from '@erxes/api-utils/src/core';
import { IContext } from '../../../connectionResolver';

const coverQueries = {
  async covers(_root, params, { models, config, posUser }: IContext) {
    const selector: any = { posToken: config.token };

    if (params.userId) {
      selector.userId = params.userId;
    }

    if (!config.adminIds.includes(posUser._id)) {
      selector.userId = posUser._id;
    }

    if (params.startDate) {
      selector.beginDate = { $gte: params.startDate };
    }

    if (params.endDate) {
      selector.endDate = { $lte: params.endDate };
    }

    return paginate(
      models.Covers.find(selector)
        .sort({ createdAt: -1 })
        .lean(),
      {
        ...params
      }
    );
  },

  async coversDetail(
    _root,
    { _id }: { _id: string },
    { models, config }: IContext
  ) {
    return models.Covers.findOne({ posToken: config.token, _id }).lean();
  }
};

export default coverQueries;
