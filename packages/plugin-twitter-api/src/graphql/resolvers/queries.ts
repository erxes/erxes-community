import { IContext } from '../../connectionResolver';
import * as twitterUtils from '../../api';

const TwitterQueries = {
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
