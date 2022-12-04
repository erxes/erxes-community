import { sendInboxMessage } from './messageBroker';
import {
  IConversationDocument,
  IIntegrationDocument
} from './models/definitions/twitter';
import { IModels, models } from './connectionResolver';

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

export const getOrCreateConversationAndMessage = async (
  models: IModels,
  subdomain: string,
  inboxId: string,
  senderId: string,
  receiverId: string,
  eventId: string,
  customerId: string,
  content: string,
  integration,
  attachments: any[]
) => {
  let conversationId;

  const relatedMessage = await models.Messages.findOne({
    senderId: senderId
  });

  if (relatedMessage) {
    conversationId = relatedMessage.inboxConversationId;
  } else {
    const { _id } = await sendInboxMessage({
      subdomain,
      action: 'integrations.receive',
      data: {
        action: 'create-or-update-conversation',
        payload: JSON.stringify({
          integrationId: inboxId,
          senderId,
          receiverId,
          customerId: customerId,
          content
        })
      },
      isRPC: true
    });
    conversationId = _id;
  }
  await models.Messages.create({
    inboxIntegrationId: inboxId,
    inboxConversationId: conversationId,
    messageId: eventId,
    senderId: senderId,
    content: content,
    receiverId: receiverId
  });
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
          conversationId: conversationId,
          attachments,
          senderId,
          receiverId
        })
      },
      isRPC: true
    });
  } catch (e) {
    await models.ConversationMessages.deleteOne({ messageId: eventId });
    throw new Error(e);
  }
  return conversationId;
};

export const saveReplyMessage = async (
  models: IModels,
  subdomain: string,
  senderId: string,
  text: string
) => {
  const res = await models.Messages.create({
    senderId: senderId,
    content: text
  });

  try {
    await sendInboxMessage({
      subdomain,
      action: 'integrations.receive',
      data: {
        action: 'create-or-update-conversation',
        payload: JSON.stringify({
          senderId,
          content: text
        })
      },
      isRPC: true
    });
  } catch (e) {
    throw new Error(e);
  }
};
