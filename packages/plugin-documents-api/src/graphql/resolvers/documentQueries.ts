import { moduleRequireLogin } from '@erxes/api-utils/src/permissions';
import { paginate } from '@erxes/api-utils/src';
import { IContext } from '../../connectionResolver';

const documentQueries = {
  /**
   * Documents list
   */
  documents(
    _root,
    {
      limit
    }: {
      limit: number;
    },
    { models }: IContext
  ) {
    const sort = { date: -1 };

    if (limit) {
      return models.Documents.find({})
        .sort(sort)
        .limit(limit);
    }

    return paginate(models.Documents.find({}), {}).sort(sort);
  },

  /**
   * Document counts
   */
  documentCounts(_root, _ars, { models }: IContext) {
    return models.Documents.find({}).countDocuments();
  }
};

moduleRequireLogin(documentQueries);

export default documentQueries;
