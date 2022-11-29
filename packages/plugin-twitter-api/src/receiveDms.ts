import {
  createConversationMessage,
  getOrCreateConversation,
  getOrCreateCustomer,
  IUser
} from './store';
import { IModels } from './connectionResolver';

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

  console.log('REQUEST BODY', requestBody);

  const users: IUsers = requestBody.users;

  if (!direct_message_events) {
    return true;
  }

  for (const event of direct_message_events) {
    const { type, message_create } = event;

    const senderId = message_create.sender_id;
    const receiverId = message_create.target.recipient_id;

    if (type === 'message_create') {
      const { message_data } = message_create;
      const { attachment } = message_data;

      const attachments: any = [];

      if (attachment) {
        attachments.push({ ...extractUrlFromAttachment(attachment) });
      }

      const account = await models.Accounts.findOne({ uid: receiverId });

      console.log('account========>', account);

      if (!account) {
        return;
      }
      console.log('models================ ', models);

      const integration = await models.Integrations.getIntegration({
        accountId: account._id
      });

      console.log('222222222222222222');

      const customer = await getOrCreateCustomer(
        models,
        subdomain,
        integration,
        senderId,
        users[senderId]
      );

      console.log('3333333333333333333');

      const content = message_data.text;
      const customerErxesApiId: any = customer.erxesApiId;

      const conversation = await getOrCreateConversation(
        models,
        subdomain,
        senderId,
        receiverId,
        integration._id,
        content,
        integration.inboxId,
        customerErxesApiId
      );

      console.log('CONVERSATION:::::::::', conversation);

      await createConversationMessage(
        models,
        subdomain,
        event,
        content,
        attachments,
        customerErxesApiId,
        conversation,
        integration
      );
    }
  }
};

export default receiveDms;
