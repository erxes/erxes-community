import { IContext } from '@erxes/api-utils/src';
import { generateModels, IModels } from '../../connectionResolver';

interface IQuestionContext extends IContext {
  subdomain: string;
}

const RCFAQueries = {
  async rcfaList(_root, args, context: IQuestionContext) {
    const model: IModels = await generateModels(context.subdomain);
    const rcfa = await model.RCFA.find({});

    return rcfa;
  },

  async rcfaDetail(_root, args, context: IQuestionContext) {
    const model: IModels = await generateModels(context.subdomain);
    const rcfaItem = await model.RCFA.findOne({
      mainType: args.mainType,
      mainTypeId: args.mainTypeId
    });

    if (!rcfaItem) {
      return [];
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
