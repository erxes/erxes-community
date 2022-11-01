import { debugRequest, debugResponse, debugTwitter } from './debuggers';
import { downloadAttachment, getEnv } from './utils';
import * as twitterUtils from './api';
import receiveDms from './receiveDms';
import { IModels } from './connectionResolver';

export const twitterCallback = async (
  models: IModels,
  { oauth_token, oauth_verifier, oauth_token_secret, redirect }
) => {
  const response = await twitterUtils.veriyfyLoginToken(
    oauth_token,
    oauth_verifier
  );

  const profile = await twitterUtils.verifyUser(
    oauth_token,
    oauth_token_secret
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

  return redirect(url);
};

export const twitterWebhook = async crc_token_param => {
  const crc_token = crc_token_param;

  if (crc_token) {
    const hash = await twitterUtils.getChallengeResponse(crc_token);

    return {
      response_token: `sha256=${hash}`
    };
  } else {
    return 'Error: crc_token missing from request.';
  }
};

export const twitterWebhookPost = async (models: IModels, { data }) => {
  try {
    await receiveDms(data, models);
  } catch (e) {
    return new Error(e);
  }
};

export const twitterGetAccount = async (models: IModels, { accountId }) => {
  const account = await models.Accounts.findOne({ _id: accountId });

  if (!account) {
    return new Error('Account not found');
  }

  return account.uid;
};

export const twitterCreateIntegration = async (
  models: IModels,
  { accountId, integrationId, data, kind }
) => {
  const prevEntry = await models.Integrations.findOne({
    accountId
  });

  if (prevEntry) {
    return new Error(`You already have integration on this account`);
  }

  const account = await models.Accounts.getAccount({ _id: accountId });

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

  return { status: 'ok ' };
};

export const twitterReply = async (
  models: IModels,
  { attachments, conversationId, content, integrationId }
) => {
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

  const account = await models.Accounts.findOne({
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
};
const init = async app => {
  app.get('/twitter/login', async (_req, res) => {
    console.log('END bas orood irsiin bishuuzde');
    const { twitterAuthUrl } = await twitterUtils.getTwitterAuthUrl();

    return res.redirect(twitterAuthUrl);
  });
  // app.get(`/twitter/callback/add`, async (models: IModels, req, res) => {
  //   const response = await twitterUtils.veriyfyLoginToken(
  //     req.query.oauth_token,
  //     req.query.oauth_verifier
  //   );

  //   const profile = await twitterUtils.verifyUser(
  //     response.oauth_token,
  //     response.oauth_token_secret
  //   );

  //   await models.Accounts.create({
  //     token: response.oauth_token,
  //     tokenSecret: response.oauth_token_secret,
  //     name: profile.screen_name,
  //     kind: 'twitter',
  //     uid: profile.id_str
  //   });

  //   const REACT_APP_API_URL = getEnv({ name: 'REACT_APP_API_URL' });

  //   const url = `${REACT_APP_API_URL}/settings/integrations?twitterAuthorized=true`;

  //   debugResponse(debugTwitter, req, url);

  //   return res.redirect(url);
  // });
};

export default init;
