import {IContext} from '@erxes/api-utils/src';
import {generateModels, IModels} from '../../connectionResolver';

const RCFAQueries = {
  async rcfaQuestions(_root, args, context) {
    const model:IModels = await generateModels(context.subdomain);
    return model.RCFAQuestions.find({});
  },

  rcfaQuestionsTotalCount(_root, args, {}: IContext) {
    return 0;
  }
};

export default RCFAQueries;
