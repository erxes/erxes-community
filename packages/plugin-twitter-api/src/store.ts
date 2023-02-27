import { sendInboxMessage } from './messageBroker';
import {
  IConversationDocument,
  IIntegrationDocument
} from './models/definitions/twitter';
import { IModels } from './connectionResolver';
import { ITweetParams } from './receiveTweets';

export interface IUser {
  id: string;
  created_timestamp: string;
  first_name: string;
  last_name: string;
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

interface IDoc {
  content?: string;
  tweetId?: string;
}

export const getOrCreateCustomer = async (
  models: IModels,
  subdomain: string,
  integration: IIntegrationDocument,
  userId: string,
  params?: IUser
) => {
  let customer = await models.Customers.findOne({ userId });

  if (customer) {
    return customer;
  }

  // create customer
  let twUser = {} as any;

  twUser.name = params?.name;

  const twUserProfilePic = params?.profile_image_url_https;

  // save on integrations db
  try {
    customer = await models.Customers.create({
      userId,
      firstName: twUser.first_name || twUser.name,
      lastName: twUser.last_name,
      integrationId: integration.inboxId,
      profilePic: twUserProfilePic
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
          firstName: params?.first_name || params?.name,
          lastName: params?.last_name || '',
          avatar: params?.profile_image_url_https,
          isUser: true
        })
      },
      isRPC: true
    });

    customer.erxesApiId = apiCustomerResponse._id;
    await customer.save();
  } catch (e) {
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
  attachments: any[],
  created_timestamp: Date
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
    receiverId: receiverId,
    createdAt: created_timestamp
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
          receiverId,
          createdAt: created_timestamp
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

export const getOrCreateTweet = async (
  models: IModels,
  subdomain: string,
  tweetParams: ITweetParams,
  integration: IIntegrationDocument,
  customerErxesApiId: string
) => {
  let tweet = await models.Tweets.findOne({
    tweetId: tweetParams.id_str
  });

  if (tweet) {
    return tweet;
  }

  const doc: IDoc = {
    tweetId: tweetParams.id_str,
    content: tweetParams.text
  };
  tweet = await models.Tweets.create(doc);

  // create conversation in api
  try {
    const apiConversationResponse = await sendInboxMessage({
      subdomain,
      action: 'integrations.receive',
      data: {
        action: 'create-or-update-conversation',
        payload: JSON.stringify({
          customerId: customerErxesApiId,
          integrationId: integration.inboxId,
          content: tweet.content
        })
      },
      isRPC: true
    });

    tweet.erxesApiId = apiConversationResponse._id;
    await tweet.save();
  } catch (e) {
    await models.Tweets.deleteOne({ _id: tweet._id });
    throw new Error(e);
  }

  return tweet;
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
