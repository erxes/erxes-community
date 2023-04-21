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
import { ViberSentMessage } from './models';
import * as jwt from 'jsonwebtoken';

const { JWT_TOKEN_SECRET = '' } = process.env;

const init = async (app: any): Promise<void> => {
  console.log('Viber Init');

  app.post(
    '/set_webhook',
    async (req: any, res: any): Promise<any> => {
      const response = await setWebhook(req.body.webhook_url);
      return res.json(response);
    }
  );

  app.post(
    '/remove_webhook',
    async (req: any, res: any): Promise<any> => {
      const response = await removeWebhook();
      return res.json(response);
    }
  );

  app.post(
    '/send_message',
    async (req: any, res: any): Promise<any> => {
      const userId = getAuthUserId(req);

      console.log({ userId });

      const response = await sendMessage(req.body);

      if (response.status === 0) {
        const viberSentMessage = new ViberSentMessage({
          user: userId,
          senderId: 'SENDER',
          receiverId: req.body.receiver,
          sendDate: new Date(),
          messageText: req.body.text
        });
        viberSentMessage.save();
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

const getAuthUserId = (req: Request) => {
  // const token = res.cookies["auth-token"];
  const token: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IkdkblQ2aDlFUXRta25HWE1ZIiwiZW1haWwiOiJlcGljYm9sZEBnbWFpbC5jb20iLCJkZXRhaWxzIjp7ImZ1bGxOYW1lIjoiYm9sZCBuYXJhbnR1eWEiLCJmaXJzdE5hbWUiOiJib2xkIiwibGFzdE5hbWUiOiJuYXJhbnR1eWEifSwiaXNPd25lciI6dHJ1ZSwiZ3JvdXBJZHMiOlsiOUt1ZnJaY0ZLcnBlZmtHTE0iXSwiYnJhbmRJZHMiOltdLCJjb2RlIjoiMDAwIiwiZGVwYXJ0bWVudElkcyI6W119LCJpYXQiOjE2ODIwMzkwODAsImV4cCI6MTY4MjEyNTQ4MH0.j3FIxRtUfqyheMYPW0gqggRVnFCcB47VddwwDeKOpIU';

  const { user }: any = jwt.verify(token, JWT_TOKEN_SECRET);

  return user._id;
};

export default init;
