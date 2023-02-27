import { getOrCreateCustomer, getOrCreateTweet } from './store';
import { IModels } from './connectionResolver';
export interface IUsers {
  id_str: string;
}

export interface ITweetParams {
  created_at: string;
  text: string;
  id_str: string;
  user: any;
}

const receiveTweets = async (models: IModels, subdomain, requestBody) => {
  const { tweet_create_events } = requestBody;

  const tweetParams: ITweetParams = tweet_create_events[0];

  let params = {} as any;

  params.first_name = tweet_create_events[0].user.name;
  params.profile_image_url_https =
    tweet_create_events[0].user.profile_image_url_https;

  const userId = tweet_create_events[0].user.id_str;

  const account = await models.Accounts.findOne({ uid: userId });

  if (!account) {
    throw new Error('Account not found');
  }

  const integration = await models.Integrations.getIntegration({
    accountId: account._id
  });

  if (!integration) {
    throw new Error('Integration not found');
  }
  const customer = await getOrCreateCustomer(
    models,
    subdomain,
    integration,
    userId
  );

  await getOrCreateTweet(
    models,
    subdomain,
    tweetParams,
    integration,
    customer.erxesApiId || ''
  );
};

export default receiveTweets;
