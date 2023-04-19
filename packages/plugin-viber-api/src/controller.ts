import {
  setWebhook,
  removeWebhook,
  sendMessage,
  broadcastMessage,
  getAccountInfo,
  getUserDetail,
  getOnline,
  subscribe
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
      const response = await sendMessage();
      return res.json(response);
    }
  );

  app.post(
    '/broadcast_message',
    async (req: any, res: any): Promise<any> => {
      const response = await broadcastMessage();
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
      const response = await getOnline();
      return res.json(response);
    }
  );

  app.post(
    '/subscribe',
    async (req: any, res: any): Promise<any> => {
      const response = await subscribe(req.body);
      return res.json(response);
    }
  );
};

export default init;
