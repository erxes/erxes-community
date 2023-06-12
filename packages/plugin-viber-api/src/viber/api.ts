import { getEnv, sendRequest } from '@erxes/api-utils/src';
import { Conversations, IConversation } from '../models';
import { sendInboxMessage } from '../messageBroker';
import { IRequestParams } from '@erxes/api-utils/src/requests';
import { ConversationMessages } from '../models';

export class ViberAPI {
  private headers: any;
  private subdomain: string;
  private integrationId: string;

  constructor(config: any) {
    this.subdomain = config.subdomain;
    this.integrationId = config.integrationId;
    this.headers = {
      'X-Viber-Auth-Token': config.token
    };
  }

  async registerWebhook(): Promise<any> {
    const domain: string = getEnv({ name: 'DOMAIN', subdomain: this.subdomain })
      ? getEnv({ name: 'DOMAIN', subdomain: this.subdomain }) + '/gateway'
      : '';

    const url: string = `${domain}/pl:viber/webhook/${this.integrationId}`;

    const payload: IRequestParams = {
      method: 'POST',
      headers: this.headers,
      url: 'https://chatapi.viber.com/pa/set_webhook',
      body: {
        url,
        event_types: [
          'delivered',
          'seen',
          'failed',
          'subscribed',
          'unsubscribed',
          'conversation_started',
          'message'
        ],
        send_name: true,
        send_photo: true
      }
    };

    try {
      const response = await sendRequest(payload);
      if (response.status === 0) {
        return response;
      } else if (response.status === 2) {
        throw new Error('Invalid Auth Token');
      } else {
        throw new Error(response.status_message);
      }
    } catch (e) {
      throw e.message;
    }
  }

  async sendMessage(message): Promise<any> {
    const conversation: IConversation | null = await Conversations.findOne(
      { erxesApiId: message.conversationId },
      { senderId: 1 }
    );

    if (!conversation) {
      throw new Error('conversation not found');
    }

    const name = await this.getName(message.integrationId);
    const plainText: string = this.convertRichTextToPlainText(message.content);

    const requestPayload: IRequestParams = {
      method: 'POST',
      headers: this.headers,
      url: 'https://chatapi.viber.com/pa/send_message',
      body: {
        receiver: conversation.senderId,
        min_api_version: 1,
        sender: {
          name,
          avatar: null
        },
        tracking_data: 'tracking data',
        type: 'text',
        text: plainText
      }
    };

    const response = await sendRequest(requestPayload);

    if (response.status !== 0) {
      if (!conversation) {
        throw new Error('message not sent');
      }
    }

    this.savetoDatabase(conversation, plainText, message);

    return response;
  }

  convertRichTextToPlainText(richText) {
    return richText.replace(/<[^>]+>/g, '');
  }

  async getName(integrationId: string) {
    const inboxIntegration = await sendInboxMessage({
      subdomain: this.subdomain,
      action: 'integrations.findOne',
      data: { _id: integrationId },
      isRPC: true,
      defaultValue: null
    });

    if (inboxIntegration) {
      return inboxIntegration.name;
    }

    return 'Viber';
  }

  async savetoDatabase(
    conversation: IConversation,
    plainText: string,
    message: any
  ) {
    await ConversationMessages.create({
      conversationId: conversation._id,
      createdAt: new Date(),
      userId: message.userId,
      customerId: null,
      content: plainText,
      messageType: 'text'
    });
  }
}
