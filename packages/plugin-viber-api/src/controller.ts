import {
  setWebhook,
  removeWebhook,
  sendMessage,
  broadcastMessage,
  getAccountInfo,
  getUserDetail,
  getOnline
} from './viber';

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
      const response = await sendMessage(req.body);
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
