import { getEnv, sendRequest } from '@erxes/api-utils/src';
import { Request, Response } from 'express';
import saveMessage from './messageListen';
import { getSubdomain } from '@erxes/api-utils/src/core';
import { Conversations } from '../models';

export const webhookListener = async (req: Request, res: Response) => {
  const subdomain = getSubdomain(req);
  console.log(req.body);
  if (req.body.event === 'message') {
    await saveMessage(req.body, req.params.integrationId, subdomain);
  }

  res.json({ status: 'success' });
};

export class ViberAPI {
  private headers: any;
  private apiUrl: string;
  private subdomain: string;
  private actions: any;
  private integrationId: string;

  constructor(config: any) {
    this.apiUrl = 'https://chatapi.viber.com';
    this.subdomain = config.subdomain;
    this.integrationId = config.integrationId;
    this.actions = {
      setWebhook: '/pa/set_webhook'
    };
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
      url: this.apiUrl + this.actions.setWebhook,
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
    // const payloadInfo = {
    //   integrationId: 'YdnEMELp6bd7gkDBH',
    //   conversationId: 'HSZ6ZvJjoFKwkKQaK',
    //   content: '<p>fsdd</p>',
    //   internal: false,
    //   attachments: [],
    //   userId: 'GdnT6h9EQtmknGXMY'
    // };

    const conversation = await Conversations.findOne(
      { erxesApiId: message.conversationId },
      { senderId: 1 }
    );

    console.log('#########', conversation?.senderId);

    const requestPayload = {
      method: 'POST',
      headers: this.headers,
      url: 'https://chatapi.viber.com/pa/send_message',
      body: {
        receiver: conversation?.senderId,
        min_api_version: 1,
        sender: {
          name: 'John McClane',
          avatar: 'http://avatar.example.com'
        },
        tracking_data: 'tracking data',
        type: 'text',
        text: message.content
      }
    };

    return await sendRequest(requestPayload);
  }
}
