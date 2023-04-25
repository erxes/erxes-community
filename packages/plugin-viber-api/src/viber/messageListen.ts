import { Timestamp } from 'mongodb';
import { Conversations, ConversationMessages } from '../models';

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
  integrationId: string
): Promise<void> => {
  let conversation = await Conversations.findOne({
    senderId: message.sender.id,
    integrationId: integrationId
  });

  console.log({ conversation });

  if (!conversation) {
    try {
      conversation = await Conversations.create({
        timestamp: message.timestamp,
        senderId: null,
        recipientId: message.sender.id,
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
    await Conversations.deleteOne({ _id: conversation._id });
    throw new Error(e);
  }
};

export default saveMessage;
