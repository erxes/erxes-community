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
  },

  async viberConversationMessages(_root, args: any, context: IContext) {
    const query = { conversationId: '' };
    const { conversationId, limit, skip, getFirst } = args;

    let messages: any[] = [];

    const conversation = await Conversations.findOne(
      { erxesApiId: conversationId },
      '_id'
    );

    if (conversation) {
      query.conversationId = conversation._id;
    }

    if (limit) {
      const sort = getFirst ? { createdAt: 1 } : { createdAt: -1 };

      messages = await ConversationMessages.find(query)
        .sort(sort)
        .skip(skip || 0)
        .limit(limit);

      return getFirst ? messages : messages.reverse();
    }

    messages = await ConversationMessages.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return messages.reverse();
  },

  async viberConversationMessagesCount(
    _root,
    { conversationId }: { conversationId: string },
    context: IContext
  ) {
    const conversation = await Conversations.findOne(
      { erxesApiId: conversationId },
      '_id'
    );

    if (conversation) {
      return ConversationMessages.countDocuments({
        conversationId: conversation._id
      });
    }

    return 0;
  }
};

export default queries;
