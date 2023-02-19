import {
  getOrCreateConversationAndMessage,
  getOrCreateCustomer,
  IUser
} from './store';
import { IModels } from './connectionResolver';
export interface IUsers {
  [key: string]: IUser;
}

const receiveDms = async (models: IModels, subdomain, requestBody) => {
  const { tweet_create_events } = requestBody;
  const { id_str } = tweet_create_events[0].user;

  const users: IUsers = requestBody.users;

  const account = await models.Accounts.findOne({ uid: id_str });

  if (!account) {
    return;
  }

  const integration = await models.Integrations.getIntegration({
    accountId: account._id
  });

  const customer = await getOrCreateCustomer(
    models,
    subdomain,
    integration,
    id_str,
    users[id_str]
  );

  //   await getOrCreatePost(
  //     models,
  //     subdomain,
  //     params,
  //     userId,
  //     customer.erxesApiId || ''
  //   );
};

export default receiveDms;
