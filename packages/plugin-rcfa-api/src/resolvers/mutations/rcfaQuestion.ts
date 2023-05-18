import { IContext } from '@erxes/api-utils/src';
import { generateModels, IModels } from '../../connectionResolver';
import { IRCFAQuestionsDocument } from '@packages/plugin-rcfa-api/src/models/definitions/question';
import { IRCFAQuestions } from '../../models/definitions/question';

interface IQuestionContext extends IContext {
  subdomain: string;
  user: any;
}

const rcfaQuestionMutations = {
  async addRcfaQuestions(
    _root: any,
    data: IRCFAQuestions,
    context: IQuestionContext
  ) {
    const model: IModels = await generateModels(context.subdomain);

    console.log('create----------', data, model);

    const newQuestion: IRCFAQuestionsDocument = await model.RCFAQuestions.create(
      {
        question: data.question,
        parentId: data.parentId,
        status: 'open',
        createdAt: new Date(),
        createdUser: context.user._id
      }
    );

    return newQuestion;
  },
  async editRcfaQuestions(
    _root,
    { _id, question }: IRCFAQuestions,
    context: IQuestionContext
  ) {
    const model: IModels = await generateModels(context.subdomain);

    await model.RCFAQuestions.findByIdAndUpdate(_id, { $set: { question } });

    return model.RCFAQuestions.findOne({ _id });
  },
  async deleteRcfaQuestions(
    _root,
    { _id }: IRCFAQuestions,
    context: IQuestionContext
  ) {
    const model: IModels = await generateModels(context.subdomain);

    return model.RCFAQuestions.deleteOne({ _id });
  }
};

export default rcfaQuestionMutations;
