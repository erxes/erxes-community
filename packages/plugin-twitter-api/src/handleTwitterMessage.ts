import { reply } from './api';
import { IModels } from './connectionResolver';

export const handleTwitterMessage = async (models: IModels, msg) => {
  const { action, payload } = msg;
  const doc = JSON.parse(payload || '{}');

  if (action === 'reply') {
    const { integrationId, conversationId, content, attachments, tag } = doc;

    const conversation: any = await models.Messages.findOne({
      inboxConversationId: conversationId
    });
    const { receiverId } = conversation;

    try {
      if (content) {
        try {
          const replyMessage = await reply(receiverId, content);

          await models.Messages.create({
            inboxIntegrationId: integrationId,
            inboxConversationId: conversationId,
            messageId: replyMessage.event.id,
            content: replyMessage.event.message_create.message_data.text
          });
        } catch (e) {
          throw new Error(e.message);
        }
      }
      return { status: 'success' };
    } catch (e) {
      throw new Error(e.message);
    }
  }
};
