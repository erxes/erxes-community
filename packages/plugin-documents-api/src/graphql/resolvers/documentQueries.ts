import { moduleRequireLogin } from '@erxes/api-utils/src/permissions';
import { paginate } from '@erxes/api-utils/src';
import { IContext } from '../../connectionResolver';
import { sendCommonMessage } from '../../messageBroker';

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

  async documentsGetEditorAttributes(
    _root,
    { contentType },
    { subdomain }: IContext
  ) {
    return sendCommonMessage({
      subdomain,
      serviceName: contentType,
      action: 'documents.editorAttributes',
      isRPC: true,
      data: {}
    });
  },

  documentsTotalCount(_root, _args, { models }: IContext) {
    return models.Documents.find({}).countDocuments();
  }
};

moduleRequireLogin(documentQueries);

export default documentQueries;
