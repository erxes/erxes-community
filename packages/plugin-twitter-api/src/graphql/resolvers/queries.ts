import { IContext } from '../../connectionResolver';
import { getEnv } from '../../utils';
import receiveDms from '../../receiveDms';
import * as twitterUtils from '../../api';

const TwitterQueries = {
  async twitterLogin(_root) {
    const { twitterAuthUrl } = await twitterUtils.getTwitterAuthUrl();
    return twitterAuthUrl;
    console.log();
  },

  async twitterCallbackAdd(
    _root,
    { oauth_token, oauth_verifier, oauth_token_secret, redirect },
    { models }: IContext
  ) {
    const response = await twitterUtils.veriyfyLoginToken(
      oauth_token,
      oauth_verifier
    );

    const profile = await twitterUtils.verifyUser(
      oauth_token,
      oauth_token_secret
    );

    await models.Accounts.create({
      token: oauth_token,
      tokenSecret: oauth_token_secret,
      name: profile.screen_name,
      kind: 'twitter',
      uid: profile.id_str
    });

    const MAIN_APP_DOMAIN = getEnv({ name: 'MAIN_APP_DOMAIN' });

    const url = `${MAIN_APP_DOMAIN}/settings/integrations?twitterAuthorized=true`;

    return redirect(url);
  },
  async twitterWebhook(_root, { crc_token_param }) {
    const crc_token = crc_token_param;

    if (crc_token) {
      const hash = await twitterUtils.getChallengeResponse(crc_token);

      return { response_token: `sha256=${hash}` };
    } else {
      return 'Error: crc_token missing from request.';
    }
  },
  async twitterWebhookGet(_root, { req, res }) {
    const crc_token = req.query.crc_token;

    if (crc_token) {
      const hash = await twitterUtils.getChallengeResponse(crc_token);

      res.status(200);
      return res.json({
        response_token: `sha256=${hash}`
      });
    } else {
      res.status(400);
      return res.send('Error: crc_token missing from request.');
    }
  },
  async twitterGetAccount(_root, { accountId }, { models }: IContext) {
    const account = await models.Accounts.findOne({ _id: accountId });

    if (!account) {
      return new Error('Account not found');
    }

    return account.uid;
  }
};
export default TwitterQueries;
