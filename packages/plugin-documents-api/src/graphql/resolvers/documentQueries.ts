import { moduleRequireLogin } from '@erxes/api-utils/src/permissions';
import { paginate } from '@erxes/api-utils/src';
import { IContext } from '../../connectionResolver';

const documentQueries = {
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

  documentsDetail(_root, { _id }, { models }: IContext) {
    return models.Documents.findOne({ _id });
  },

  documentsTotalCount(_root, _args, { models }: IContext) {
    return models.Documents.find({}).countDocuments();
  }
};

moduleRequireLogin(documentQueries);

export default documentQueries;
