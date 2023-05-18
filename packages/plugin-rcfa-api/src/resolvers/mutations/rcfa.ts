import { IContext } from '@erxes/api-utils/src';
import { generateModels, IModels } from '../../connectionResolver';
import { IRCFAQuestionsDocument } from '@packages/plugin-rcfa-api/src/models/definitions/rcfa';
import { IRCFAQuestions } from '../../models/definitions/rcfa';

interface IQuestionContext extends IContext {
  subdomain: string;
  user: any;
}

const RCFAMutations = {
  async addRcfaQuestions(
    _root: any,
    data: IRCFAQuestions,
    context: IQuestionContext
  ) {
    const model: IModels = await generateModels(context.subdomain);

    const newQuestion: IRCFAQuestionsDocument = await model.RCFAQuestions.create(
      {
        title: data.title,
        mainType: data.mainType,
        mainTypeId: data.mainTypeId,
        status: 'open',
        createdAt: new Date(),
        createdUser: context.user._id
      }
    );

    return newQuestion;
  },
  async editRcfaQuestions(
    _root,
    { _id, title }: IRCFAQuestions,
    context: IQuestionContext
  ) {
    const model: IModels = await generateModels(context.subdomain);

    await model.RCFAQuestions.findByIdAndUpdate(_id, { $set: { title } });

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

export default RCFAMutations;
