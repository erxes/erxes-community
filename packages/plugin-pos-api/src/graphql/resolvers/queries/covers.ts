import { paginate } from '@erxes/api-utils/src/core';
import { IContext } from '../../../connectionResolver';

const coverQueries = {
  async covers(_root, params, { models }: IContext) {
    return paginate(
      models.Covers.find({})
        .sort({ createdAt: -1 })
        .lean(),
      {
        ...params
      }
    );
  },

  async coversDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Covers.find({ _id });
  }
};

export default coverQueries;
