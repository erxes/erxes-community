import { getEnv, sendRequest } from '@erxes/api-utils/src';
import { Request, Response } from 'express';
import saveMessage from './messageListen';

export const webhookListener = (req: Request, res: Response) => {
  if (req.body.event === 'message') {
    saveMessage(req.body, req.params.integrationId);
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
      : 'https://644a-202-21-104-34.ngrok-free.app';

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
      console.log(response);
      if (response.status !== 0) {
        throw new Error(response.status_message);
      }

      return response;
    } catch (e) {
      throw e.message;
    }
  }
}
