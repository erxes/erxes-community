import * as twitterApi from './api';
import { getConfig } from './utils';
import * as twitterUtils from './api';

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
};
