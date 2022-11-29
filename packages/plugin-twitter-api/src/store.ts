import { sendInboxMessage } from './messageBroker';
import {
  IConversationDocument,
  IIntegrationDocument
} from './models/definitions/twitter';
import { IModels, models } from './connectionResolver';
import { Customers } from './models/Customers';
import { Conversations } from './models/Conversations';

export interface IUser {
  id: string;
  created_timestamp: string;
  name: string;
  screen_name: string;
  protected: boolean;
  verified: boolean;
  followers_count: number;
  friends_count: number;
  statuses_count: number;
  profile_image_url: string;
  profile_image_url_https: string;
}

export const getOrCreateCustomer = async (
  models: IModels,
  subdomain: string,
  integration: IIntegrationDocument,
  userId: string,
  receiver: IUser
) => {
  let customer = await models.Customers.findOne({ userId });

  if (customer) {
    return customer;
  }

  // save on integrations collection
  try {
    customer = await models.Customers.create({
      userId: receiver.id,
      // not integrationId on erxes-api !!
      integrationId: integration.inboxId,
      profilePic: receiver.profile_image_url_https,
      name: receiver.name,
      screenName: receiver.screen_name
    });
  } catch (e) {
    throw new Error(
      e.message.includes('duplicate')
        ? 'Concurrent request: customer duplication'
        : e
    );
  }

  // save on api
  try {
    const apiCustomerResponse = await sendInboxMessage({
      subdomain,
      action: 'integrations.receive',
      data: {
        action: 'get-create-update-customer',
        payload: JSON.stringify({
          integrationId: integration.inboxId,
          firstName: receiver.screen_name,
          avatar: receiver.profile_image_url_https,
          isUser: true
        })
      },
      isRPC: true
    });

    console.log('apiCustomerResponse========>', apiCustomerResponse);

    customer.erxesApiId = apiCustomerResponse._id;
    await customer.save();
  } catch (e) {
    console.log('Aldaanii medeelel bol:', e);

    await models.Customers.deleteOne({ _id: customer._id });
    throw new Error(e);
  }

  return customer;
};

export const getOrCreateConversation = async (
  models: IModels,
  subdomain: string,
  senderId: string,
  receiverId: string,
  integrationId: string,
  content: string,
  inboxId: string,
  customerErxesApiId: string
) => {
  let conversation = await models.Conversations.findOne({
    senderId,
    receiverId
  });

  if (conversation) {
    return conversation;
  }

  // create conversation

  // save on integrations db
  try {
    conversation = await models.Conversations.create({
      senderId,
      receiverId,
      content,
      integrationId
    });
  } catch (e) {
    throw new Error(
      e.message.includes('duplicate')
        ? 'Concurrent request: conversation duplication'
        : e
    );
  }

  // save on api
  try {
    const apiConversationResponse = await sendInboxMessage({
      subdomain,
      action: 'integrations.receive',
      data: {
        action: 'create-or-update-conversation',
        payload: JSON.stringify({
          customerId: customerErxesApiId,
          integrationId: inboxId,
          content
        })
      },
      isRPC: true
    });

    conversation.erxesApiId = apiConversationResponse._id;

    await conversation.save();
  } catch (e) {
    await models.Conversations.deleteOne({ _id: conversation._id });
    throw new Error(e);
  }

  return conversation;
};

export const createConversationMessage = async (
  models: IModels,
  subdomain: string,
  event: any,
  content: string,
  attachments: any[],
  customerErxesApiId: string,
  conversation: IConversationDocument,
  integration
) => {
  console.log('event ni yu we', event);

  const { id, created_timestamp } = event;

  console.log('id yu we', id);

  const conversationMessage = await models.ConversationMessages.findOne({
    messageId: id
  });
  console.log('conversationMessage::::::::::::::', conversationMessage);

  if (!conversationMessage) {
    // save on integrations db
    await models.ConversationMessages.create({
      conversationId: conversation._id,
      messageId: id,
      content,
      timestamp: created_timestamp
    });

    // save message on api
    try {
      await sendInboxMessage({
        subdomain,
        action: 'integrations.receive',
        data: {
          action: 'create-conversation-message',
          metaInfo: 'replaceContent',
          payload: JSON.stringify({
            integrationId: integration.inboxId,
            content,
            conversationId: conversation.erxesApiId,
            customerId: customerErxesApiId,
            attachments
          })
        },
        isRPC: true
      });
    } catch (e) {
      await models.ConversationMessages.deleteOne({ messageId: id });
      throw new Error(e);
    }
  }
};
