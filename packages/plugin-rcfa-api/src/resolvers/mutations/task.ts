import { IContext } from '@erxes/api-utils/src';
import { sendCardsMessage } from '../../messageBroker';

interface IQuestionContext extends IContext {
  subdomain: string;
  user: any;
}

interface IRCFATask {
  type: string;
  stageId: string;
  pipelineId: string;
  boardId: string;
  name: string;
}

const TaskMutations = {
  async rcfaCreateRelatedTask(
    _root,
    data: IRCFATask,
    context: IQuestionContext
  ) {
    await sendCardsMessage({
      subdomain: context.subdomain,
      action: 'createRelatedItem',
      data,
      isRPC: true
    });

    return { status: 'done' };
  }
};

export default TaskMutations;

// plugin-grants-api/src/utils/
//   if (action === 'changeCardType') {
//   await sendCardsMessage({
//     subdomain,
//     action: 'createRelatedItem',
//     data,
//     isRPC: true
//   });
//   return 'success';
// }
