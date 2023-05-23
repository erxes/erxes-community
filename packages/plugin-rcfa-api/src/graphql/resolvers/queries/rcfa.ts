import { paginate } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';

const generateFilters = async params => {
  const filter: object = {};

  return filter;
};

const RCFAQueries = {
  async rcfaList(
    _root,
    params: { searchValue?: string; perPage: number; page: number },
    { models }: IContext
  ) {
    const filter = await generateFilters(params);

    const list = paginate(
      models.RCFA.find(filter).sort({ createdAt: 1 }),
      params
    );

    const totalCount = models.RCFA.find(filter).countDocuments();

    return { list, totalCount };
  },

  async rcfaDetail(_root, args, { models }: IContext) {
    const rcfaItem = await models.RCFA.findOne(args);

    if (!rcfaItem) {
      throw new Error('Cannot find RCFA');
    }

    return rcfaItem;
  }
};

export default RCFAQueries;
