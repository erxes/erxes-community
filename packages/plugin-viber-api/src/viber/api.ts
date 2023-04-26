import { getEnv, sendRequest } from '@erxes/api-utils/src';
import { Conversations } from '../models';
import { sendInboxMessage } from '../messageBroker';

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

  async registerWebhook() {
    const domain = getEnv({ name: 'DOMAIN', subdomain: this.subdomain })
      ? getEnv({ name: 'DOMAIN', subdomain: this.subdomain }) + '/gateway'
      : 'https://0ec7-202-21-104-34.ngrok-free.app';

    const url = `${domain}/pl:viber/webhook/${this.integrationId}`;

    const payload = {
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

      if (response.status !== 0) {
        throw new Error(response.status_message);
      }

      return response;
    } catch (e) {
      throw e.message;
    }
  }

  async sendMessage(message) {
    const conversation = await Conversations.findOne(
      { erxesApiId: message.conversationId },
      { senderId: 1 }
    );

    if (!conversation) {
      throw new Error('conversation not found');
    }

    const name = await this.getName(message.integrationId);
    const plainText = this.convertRichTextToPlainText(message.content);

    const requestPayload = {
      method: 'POST',
      headers: this.headers,
      url: 'https://chatapi.viber.com/pa/send_message',
      body: {
        receiver: conversation.senderId,
        min_api_version: 1,
        sender: {
          name: name,
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

    return response;
  }

  convertRichTextToPlainText(richText) {
    var plainText = richText.replace(/<[^>]+>/g, '');
    return plainText;
  }

  async getName(integrationId: string) {
    let name = 'Viber';

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

    return name;
  }
}
