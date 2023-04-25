import { Customers, Conversations, ConversationMessages } from '../models';
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
  const customer = await Customers.getOrCreate(
    {
      inboxIntegrationId: integrationId,
      contactsId: null,
      viberId: message.sender.id,
      name: message.sender.name,
      country: message.sender.country
    },
    subdomain
  );

  console.log('#############');
  console.log(customer);
  console.log('#############');

  let conversation = await Conversations.findOne({
    senderId: message.sender.id,
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

    try {
      const apiConversationResponse = await sendInboxMessage({
        subdomain,
        action: 'integrations.receive',
        data: {
          action: 'create-or-update-conversation',
          payload: JSON.stringify({
            customerId: customer.contactsId,
            integrationId: integrationId,
            content: message.message.text || '',
            attachments: null,
            conversationId: conversation.erxesApiId,
            updatedAt: message.timestamp
          })
        },
        isRPC: true
      });
      console.log('sendInboxMessage - create-or-update-conversation');
      conversation.erxesApiId = apiConversationResponse._id;

      await conversation.save();
    } catch (e) {
      // await models.Conversations.deleteOne({ _id: conversation._id });
      throw new Error(e);
    }
  }

  try {
    const conversationMessage = await ConversationMessages.create({
      conversationId: conversation._id,
      timestamp: message.timestamp,
      userId: null,
      customerId: message.sender.id,
      messageText: message.message.text,
      messageType: message.message.type
    });

    await sendInboxMessage({
      subdomain,
      action: 'conversationClientMessageInserted',
      data: {
        userId: conversationMessage.userId,
        conversationId: conversation.erxesApiId,
        createdAt: message.timestamp,
        content: conversationMessage.messageText,
        customerId: customer.contactsId
      }
    });
    console.log('sendInboxMessage - conversationClientMessageInserted');
  } catch (e) {
    throw new Error(e);
  }
};

export default saveMessage;
