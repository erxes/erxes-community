import { downloadAttachment, getEnv } from './utils';
import * as twitterUtils from './api';
import receiveDms from './receiveDms';
import { IModels } from './connectionResolver';
import Accounts from './models/Accounts';

const init = async app => {
  app.get('/login', async (_req, res) => {
    const { twitterAuthUrl } = await twitterUtils.getTwitterAuthUrl();

    return res.redirect(twitterAuthUrl);
  });
  app.get(`/callback/add`, async (req, res) => {
    const response = await twitterUtils.verifyLoginToken(
      req.query.oauth_token,
      req.query.oauth_verifier
    );
    const profile = await twitterUtils.verifyUser(
      response.oauth_token,
      response.oauth_token_secret
    );
    await Accounts.create({
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
  app.get('/twitter/webhook', async (req, res) => {
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
  app.post('/twitter/webhook', async (req, res) => {
    try {
      await receiveDms(req.body);
    } catch (e) {
      return new Error(e);
    }

    res.sendStatus(200);
  });
  app.get('/twitter/get-account', async (req, res, models: IModels) => {
    const account = await Accounts.findOne({ _id: req.query.accountId });

    if (!account) {
      return 'Account not found';
    }

    return account.uid;
  });
  app.post('/twitter/create-integration', async (req, models: IModels) => {
    const { accountId, integrationId, data, kind } = req.body;

    const prevEntry = await models.Integrations.findOne({
      accountId
    });

    if (prevEntry) {
      return `You already have integration on this account`;
    }

    const account = await Accounts.getAccount({ _id: accountId });

    await models.Integrations.create({
      kind,
      accountId,
      erxesApiId: integrationId,
      twitterAccountId: data.twitterAccountId
    });

    try {
      await twitterUtils.subscribeToWebhook(account);
    } catch (e) {
      // deleting previous subscription
      if (e.message.includes('already exists')) {
        await twitterUtils.removeFromWebhook(account);

        // adding new subscription
        await twitterUtils.subscribeToWebhook(account);
      }
    }
  });
  app.post('/twitter/reply', async (req, models: IModels) => {
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

    const conversation = await models.Conversations.getConversation({
      erxesApiId: conversationId
    });

    const integration = await models.Integrations.findOne({
      erxesApiId: integrationId
    });

    const account = await Accounts.findOne({
      _id: integration?.accountId
    });

    const recipientId = conversation.senderId;

    const message = await twitterUtils.reply(
      recipientId,
      content,
      attachment,
      account!
    );

    const { event } = message;
    const { id, created_timestamp, message_create } = event;
    const { message_data } = message_create;

    // save on integrations db
    await models.ConversationMessages.create({
      conversationId: conversation._id,
      messageId: id,
      timestamp: created_timestamp,
      content: message_data.text
    });
  });
};

export default init;
