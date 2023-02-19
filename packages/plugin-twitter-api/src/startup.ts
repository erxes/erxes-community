import * as twitterApi from './api';
import { getConfig } from './utils';

export const initStart = async () => {
  const TWITTER_CONSUMER_KEY = await getConfig('TWITTER_CONSUMER_KEY');
  if (TWITTER_CONSUMER_KEY) {
    try {
      await twitterApi.registerWebhook();
      await twitterApi.twitterPutWebhook();
      await twitterApi.subscribeToWebhook();
    } catch (e) {}
  }
};
