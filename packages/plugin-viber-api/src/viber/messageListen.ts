import { Timestamp } from 'mongodb';
import { Conversations, ConversationMessages } from '../models';
import { sendInboxMessage } from '../messageBroker';
interface IWebhookMessage {
  event: String;
  timestamp: Number;
  sender: {
    id: String;
    name: String;
    country: String;
  };
  message: {
    text: String;
    type: String;
  };
}

const saveMessage = async (
  message: IWebhookMessage,
  integrationId: string,
  subdomain: string
): Promise<void> => {
  let conversation = await Conversations.findOne({
    recipientId: message.sender.id,
    integrationId: integrationId
  });

  if (!conversation) {
    try {
      conversation = await Conversations.create({
        timestamp: message.timestamp,
        senderId: message.sender.id,
        recipientId: null,
        integrationId: integrationId
      });
    } catch (e) {
      throw new Error(
        e.message.includes('duplicate')
          ? 'Concurrent request: conversation duplication'
          : e
      );
    }
  }

  try {
    ConversationMessages.create({
      conversationId: conversation._id,
      timestamp: message.timestamp,
      userId: null,
      customerId: message.sender.id,
      messageText: message.message.text,
      messageType: message.message.type
    });
  } catch (e) {
    throw new Error(e);
  }

  try {
    const apiConversationResponse = await sendInboxMessage({
      subdomain,
      action: 'integrations.receive',
      data: {
        action: 'create-or-update-conversation',
        payload: JSON.stringify({
          customerId: message.sender.id,
          integrationId: integrationId,
          content: message.message.text || '',
          attachments: null,
          conversationId: conversation.erxesApiId,
          updatedAt: message.timestamp
        })
      },
      isRPC: true
    });

    conversation.erxesApiId = apiConversationResponse._id;

    await conversation.save();
  } catch (e) {
    // await models.Conversations.deleteOne({ _id: conversation._id });
    throw new Error(e);
  }
};

export default saveMessage;
