import { IContext } from '@erxes/api-utils/src';
import { sendCardsMessage } from '../../messageBroker';

interface IQuestionContext extends IContext {
  subdomain: string;
  user: any;
}

interface IRCFATask {
  type: string;
  name: string;
  stageId: string;
  sourceType: string;
  itemId: string;
  pipelineId?: string;
  boardId?: string;
}

const TaskMutations = {
  async rcfaCreateRelatedTask(
    _root,
    data: IRCFATask,
    context: IQuestionContext
  ) {
    const payload = {
      type: data.type,
      sourceType: data.sourceType,
      itemId: data.itemId,
      name: data.name,
      stageId: data.stageId
    };

    await sendCardsMessage({
      subdomain: context.subdomain,
      action: 'createRelatedItem',
      data: payload,
      isRPC: true
    });

    return { status: 'done' };
  }
};

export default TaskMutations;
