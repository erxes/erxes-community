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

  const params: ITweetParams = tweet_create_events[0];

  const { id_str } = tweet_create_events[0].user;

  const account = await models.Accounts.findOne({ uid: id_str });

  if (!account) {
    return;
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
    id_str
  );

  await getOrCreateTweet(
    models,
    subdomain,
    params,
    integration,
    customer.erxesApiId || ''
  );
};

export default receiveTweets;
