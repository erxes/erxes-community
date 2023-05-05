import {generateModels, IModels} from '../../connectionResolver';
import {IRCFAQuestionsDocument} from "@packages/plugin-rcfa-api/src/models/definitions/rcfa";

const RCFAMutations = {
  async addRcfaQuestions(_root, { title }, context: any) {
    const model:IModels = await generateModels(context.subdomain);

    const newQuestion:IRCFAQuestionsDocument = await model.RCFAQuestions.create({
      title,
      status: 'created',
      createdAt: new Date(),
      createdUser: context.user._id
    });

    return newQuestion;
  }
};

export default RCFAMutations;
