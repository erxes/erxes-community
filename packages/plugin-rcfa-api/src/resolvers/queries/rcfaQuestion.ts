import { IContext } from '@erxes/api-utils/src';
import { generateModels, IModels } from '../../connectionResolver';

interface IQuestionContext extends IContext {
  subdomain: string;
}

const RCFAQuestionQueries = {
  async rcfaQuestions(_root, args, context: IQuestionContext) {
    const model: IModels = await generateModels(context.subdomain);
    return model.RCFAQuestions.find({
      mainType: args.mainType,
      mainTypeId: args.mainTypeId
    });
  }
};

export default RCFAQuestionQueries;
