import { paginate } from '@erxes/api-utils/src/core';
import { IContext } from '../../../connectionResolver';

const coverQueries = {
  async covers(_root, params, { models, config }: IContext) {
    return paginate(
      models.Covers.find({ posToken: config.token })
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
    return models.Covers.find({ posToken: config.token, _id });
  }
};

export default coverQueries;
