import {
  setWebhook,
  removeWebhook,
  sendMessage,
  broadcastMessage,
  getAccountInfo,
  getUserDetail,
  getOnline
} from './viber';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

const { JWT_TOKEN_SECRET = '' } = process.env;

const init = async (app: any): Promise<void> => {
  console.log('Viber plugin init');

  app.post(
    '/send_message',
    async (req: any, res: any): Promise<any> => {
      const response = await sendMessage(req.body);
      if (response.status === 0) {
      }
      return res.json(response);
    }
  );

  app.post(
    '/broadcast_message',
    async (req: any, res: any): Promise<any> => {
      const response = await broadcastMessage(req.body);
      return res.json(response);
    }
  );

  app.post(
    '/get_account_info',
    async (req: any, res: any): Promise<any> => {
      const response = await getAccountInfo();
      return res.json(response);
    }
  );

  app.post(
    '/get_user_detail',
    async (req: any, res: any): Promise<any> => {
      const response = await getUserDetail(req.body.id);
      return res.json(response);
    }
  );

  app.post(
    '/get_online',
    async (req: any, res: any): Promise<any> => {
      const response = await getOnline(req.body);
      return res.json(response);
    }
  );
};

export default init;
