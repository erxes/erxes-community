import {
  getOrCreateConversationAndMessage,
  getOrCreateCustomer,
  IUser
} from './store';
import { IModels } from './connectionResolver';
import Accounts from './models/Accounts';

export interface IUsers {
  [key: string]: IUser;
}

const extractUrlFromAttachment = attachment => {
  const { media } = attachment;
  const { type }: any = media;

  if (type === 'animated_gif') {
    const { video_info } = media;

    const { variants } = video_info;

    return { url: variants[0].url, type: 'video/mp4' };
  }

  return null;
};

const receiveDms = async (models: IModels, subdomain, requestBody) => {
  const { direct_message_events } = requestBody;

  const users: IUsers = requestBody.users;

  if (!direct_message_events) {
    return true;
  }

  for (const event of direct_message_events) {
    const { type, message_create, id } = event;

    const senderId = message_create.sender_id;
    const receiverId = message_create.target.recipient_id;
    const eventId = id;

    if (type === 'message_create') {
      const { message_data } = message_create;
      const { attachment } = message_data;

      const attachments: any = [];

      if (attachment) {
        attachments.push({ ...extractUrlFromAttachment(attachment) });
      }

      const account = await Accounts.findOne({ uid: receiverId });

      if (!account) {
        return;
      }

      const integration = await models.Integrations.getIntegration({
        accountId: account._id
      });

      const customer = await getOrCreateCustomer(
        models,
        subdomain,
        integration,
        senderId,
        users[senderId]
      );

      const content = message_data.text;
      const customerId: any = customer.erxesApiId;

      await getOrCreateConversationAndMessage(
        models,
        subdomain,
        integration.inboxId,
        senderId,
        receiverId,
        eventId,
        customerId,
        content,
        integration,
        attachments
      );
    }
  }
};

export default receiveDms;
