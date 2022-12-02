import { IContext } from '../../connectionResolver';

const TwitterQueries = {
  async twitterConversationDetail(
    _root,
    { conversationId },
    { models }: IContext
  ) {
    const messages = await models.Messages.find({
      inboxConversationId: conversationId
    });
    return messages.map(message => {
      return {
        _id: message._id,
        data: {
          messageId: message.messageId,
          content: message.content,
          customer: message.senderId,
          user: message.receiverId
        }
      };
    });
  }
};
export default TwitterQueries;
