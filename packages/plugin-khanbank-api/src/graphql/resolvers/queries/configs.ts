import { checkPermission, paginate, requireLogin } from '@erxes/api-utils/src';

import { IContext } from '../../../connectionResolver';

const queries = {
  async khanbankConfigsList(
    _root,
    { page, perPage }: { page: number; perPage: number },
    { models }: IContext
  ) {
    const response = await models.KhanbankConfigs.find({}).sort({
      createdAt: -1
    });

    const totalCount = await models.KhanbankConfigs.find({}).countDocuments();

    return {
      list: paginate(response, { page: page || 1, perPage: perPage || 20 }),
      totalCount
    };
  },

  async khanbankConfigs(
    _root,
    { page, perPage }: { page: number; perPage: number },
    { models }: IContext
  ) {
    const response = await models.KhanbankConfigs.find({}).sort({
      createdAt: -1
    });

    return paginate(response, { page: page || 1, perPage: perPage || 20 });
  },

  async khanbankConfigsDetail(
    _root,
    { _id }: { _id: string },
    { models }: IContext
  ) {
    return models.KhanbankConfigs.getConfig({ _id });
  }
};

requireLogin(queries, 'khanbank');
checkPermission(queries, 'khanbank', 'showKhanbankConfigs', []);

export default queries;
