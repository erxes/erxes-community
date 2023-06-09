import { IContext } from '../../connectionResolver';
import { Conversations, ConversationMessages } from '../../models';

const queries = {
  async viberConversationDetail(_root, { conversationId }, context: IContext) {
    let conversation: any = await Conversations.findOne(
      { erxesApiId: conversationId },
      '_id'
    );

    if (conversation) {
      const messages = ConversationMessages.find({
        conversationId: conversation._id
      }).sort('createdAt');
      return messages;
    }

    return [];
  }
};

export default queries;
