import { IContext } from '@erxes/api-utils/src';
import { generateModels, IModels } from '../../connectionResolver';
import { IRCFAQuestionsDocument } from '@packages/plugin-rcfa-api/src/models/definitions/rcfa';
import { IRCFAQuestions } from '../../models/definitions/rcfa';

interface IQuestionContext extends IContext {
  subdomain: string;
  user: any;
}

const TaskMutations = {
  async rcfaCreateRelatedTask(_root, data, context: IQuestionContext) {
    console.log(data);
    return { status: 'done' };
  }
};

export default TaskMutations;
