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
    _root,
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
  }
};

export default RCFAMutations;
