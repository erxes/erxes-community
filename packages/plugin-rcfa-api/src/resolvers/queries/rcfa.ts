import { IContext } from '@erxes/api-utils/src';
import { generateModels, IModels } from '../../connectionResolver';
import { paginate } from '@erxes/api-utils/src';

interface IQuestionContext extends IContext {
  subdomain: string;
}

const generateFilters = async ({
  models,
  type,
  params
}: {
  models: IModels;
  type: string;
  params: any;
}) => {
  const filter: object = {};

  return filter;
};

const RCFAQueries = {
  async rcfaList(
    _root,
    params: { searchValue?: string; perPage: number; page: number },
    context: IQuestionContext
  ) {
    const models: IModels = await generateModels(context.subdomain);

    const filter = await generateFilters({
      models,
      type: 'department',
      params: { params }
    });

    const list = paginate(models.RCFA.find(filter).sort({ order: 1 }), params);

    const totalCount = models.RCFA.find(filter).countDocuments();

    return { list, totalCount };
  },

  async rcfaDetail(_root, args, context: IQuestionContext) {
    const model: IModels = await generateModels(context.subdomain);

    const rcfaItem = await model.RCFA.findOne(args);

    if (!rcfaItem) {
      return {};
    }

    const payload = {
      _id: rcfaItem._id,
      mainType: rcfaItem.mainType,
      mainTypeId: rcfaItem.mainTypeId,
      status: rcfaItem.status,
      createdAt: rcfaItem.createdAt,
      createdUser: rcfaItem.createdUser,
      questions: await model.RCFAQuestions.find({ rcfaId: rcfaItem._id })
    };

    return payload;
  }
};

export default RCFAQueries;
