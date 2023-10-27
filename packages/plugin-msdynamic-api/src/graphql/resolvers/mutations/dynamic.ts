import { sendRequest } from '@erxes/api-utils/src';
import { IContext } from '../../../messageBroker';
import { getConfig } from '../../../utils';

const msdynamicMutations = {
  /**
   * Creates a new msdynamic
   */
  async msdynamicAddConfigs(_root, doc, { models }: IContext) {
    return await models.Msdynamics.createMsdynamicConfig(doc);
  },
  /**
   * Edits a new msdynamic
   */
  async msdynamicEditConfigs(_root, doc, { models, user }: IContext) {
    return await models.Msdynamics.updateMsdynamicConfig(doc, user);
  },

  async toCheckProducts(_root, _args, { models, subdomain }: IContext) {
    const config = await getConfig(subdomain, 'DYNAMIC', {});

    if (!config.endpoint || !config.username || !config.password) {
      throw new Error('MS Dynamic config not found.');
    }

    const { endpoint, username, password } = config;

    try {
      const response = await sendRequest({
        url: endpoint,
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${username}:${password}`
          ).toString('base64')}`
        }
      });

      console.log(response.value, 'responce');
    } catch (e) {
      return console.log(e, 'error');
    }

    return 'success';
  }
};

export default msdynamicMutations;
