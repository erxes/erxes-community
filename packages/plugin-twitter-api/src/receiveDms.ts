import {
  createConversationMessage,
  getOrCreateConversation,
  getOrCreateCustomer,
  IUser
} from './store';
import Accounts from './models/Accounts';
import Integrations from './models/Integrations';

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

const receiveDms = async requestBody => {
  const { direct_message_events } = requestBody;

  console.log('REQUEST BODY', requestBody);

  const users: IUsers = requestBody.users;

  if (!direct_message_events) {
    return true;
  }

  for (const event of direct_message_events) {
    const { type, message_create } = event;

    console.log('type', type);
    console.log('message_create', message_create);

    const senderId = message_create.sender_id;
    const receiverId = message_create.target.recipient_id;

    if (type === 'message_create') {
      const { message_data } = message_create;
      const { attachment } = message_data;

      const attachments: any = [];

      if (attachment) {
        attachments.push({ ...extractUrlFromAttachment(attachment) });
      }

      const account = await Accounts.findOne({ uid: receiverId });

      console.log('account========>', account);

      if (!account) {
        return;
      }

      console.log('11111111111111111');
      console.log('Account::::::::::', account);

      const integration = await Integrations.getIntegration({
        $and: [{ id: account._id }, { kind: 'twitter' }]
      });
      console.log('INTEGRATIONNNNNNNNNNNn', integration);

      console.log('222222222222222222');

      const customer = await getOrCreateCustomer(
        integration,
        senderId,
        users[senderId]
      );

      console.log('3333333333333333333');

      const content = message_data.text;
      const customerErxesApiId: any = customer.erxesApiId;

      console.log('======================================');

      console.log('SenderId', senderId);
      console.log('ReceiverId', receiverId);
      console.log('IntegrationId', integration.id);
      console.log('Content', content);
      console.log('CustomerErxesApiId', customerErxesApiId);
      console.log('Integration erxesApiId', integration.erxesApiId);

      const conversation = await getOrCreateConversation(
        senderId,
        receiverId,
        integration._id,
        content,
        customerErxesApiId,
        integration.erxesApiId
      );

      await createConversationMessage(
        event,
        content,
        attachments,
        customerErxesApiId,
        conversation
      );
    }
  }
};

export default receiveDms;
