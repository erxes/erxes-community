import * as twitterApi from './api';
import { getConfig } from './utils';
import * as twitterUtils from './api';
import receiveDms from './receiveDms';

export const initStart = async app => {
  const TWITTER_CONSUMER_KEY = await getConfig('TWITTER_CONSUMER_KEY');
  if (TWITTER_CONSUMER_KEY) {
    try {
      await twitterApi.registerWebhook();
    } catch (e) {}
  }

  app.get('/webhook', async (req, res) => {
    const crc_token = req.query.crc_token;

    if (crc_token) {
      const hash = await twitterUtils.getChallengeResponse(crc_token);

      return res.json({
        response_token: `sha256=${hash}`
      });
    } else {
      return 'Error: crc_token missing from request.';
    }
  });
  app.post('/webhook', async (req, res) => {
    console.log('RESONSE NI YU WEee?', res);

    console.log('Twitter Post Webhook ajillaj baina uu? ');

    console.log('REquest body bol: ', req);

    try {
      await receiveDms(req.body);
    } catch (e) {
      return new Error(e);
    }

    res.sendStatus(200);
  });
};
