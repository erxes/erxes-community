import { downloadAttachment, getConfig, getEnv } from './utils';
import * as twitterUtils from './api';
import receiveDms from './receiveDms';
import { generateModels, IModels } from './connectionResolver';
import { getSubdomain } from '@erxes/api-utils/src/core';
import Accounts from './models/Accounts';

const init = async app => {
  app.get('/login', async (_req, res) => {
    const { twitterAuthUrl } = await twitterUtils.getTwitterAuthUrl();

    return res.redirect(twitterAuthUrl);
  });

  app.get(`/callback/add`, async (req, res) => {
    const subdomain = getSubdomain(req);
    const models = await generateModels(subdomain);

    const response = await twitterUtils.verifyLoginToken(
      req.query.oauth_token,
      req.query.oauth_verifier
    );
    const profile = await twitterUtils.verifyUser(
      response.oauth_token,
      response.oauth_token_secret
    );

    await models.Accounts.create({
      token: response.oauth_token,
      tokenSecret: response.oauth_token_secret,
      name: profile.screen_name,
      kind: 'twitter',
      uid: profile.id_str
    });

    const MAIN_APP_DOMAIN = getEnv({ name: 'MAIN_APP_DOMAIN' });

    const url = `${MAIN_APP_DOMAIN}/settings/integrations?twitterAuthorized=true`;

    return res.redirect(url);
  });

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

  app.put('/webhook', async (_req, res) => {
    try {
      await twitterUtils.twitterPutWebhook();
    } catch (e) {
      console.log(e);
    }
    return res.json({ success: true });
  });

  app.post('/webhook', async (req, res) => {
    const subdomain = getSubdomain(req);
    const models = await generateModels(subdomain);

    try {
      await receiveDms(models, subdomain, req.body);
    } catch (e) {
      console.log('Webhook post husel deerh aldaanii medeelel:', e);

      return new Error(e);
    }

    res.sendStatus(200);
  });

  app.post('/reply', async (req, _res) => {
    const subdomain = getSubdomain(req);
    const models = await generateModels(subdomain);

    const { attachments, conversationId, content, integrationId } = req.body;

    if (attachments.length > 1) {
      return new Error('You can only attach one file');
    }

    const attachment = {
      media: {
        id: null
      },
      type: 'media'
    };

    for (const attach of attachments) {
      const base64 = await downloadAttachment(attach.url);
      attachment.media.id = attach.url;

      const response: any = await twitterUtils.upload(base64);
      attachment.media.id = JSON.parse(response).media_id_string;
    }

    const conversation: any = await models.ConversationMessages.findOne({
      conversationId: conversationId
    });

    const integration = await models.Integrations.findOne({
      erxesApiId: integrationId
    });

    const account = await models.Accounts.findOne({
      _id: integration?.accountId
    });

    const recipientId = conversation.senderId;

    const message = await twitterUtils.reply(recipientId, content);

    const { event } = message;
    const { id, created_timestamp, message_create } = event;
    const { message_data } = message_create;

    // save on integrations db

    await models.ConversationMessages.create({
      conversationId: conversationId,
      messageId: id,
      timestamp: created_timestamp,
      content: message_data.text
    });
  });
};

export default init;
