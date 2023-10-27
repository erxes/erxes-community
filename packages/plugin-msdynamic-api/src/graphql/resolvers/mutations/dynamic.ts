import { sendRequest } from '@erxes/api-utils/src';
import { IContext } from '../../../messageBroker';
import { consumeInventory, getConfig } from '../../../utils';

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
    } catch (e) {
      console.log(e, 'error');
    }

    return 'success';
  },

  async toSyncProducts(
    _root,
    { action }: { action: string },
    { models, subdomain }: IContext
  ) {
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

      if (response && response.value.length > 0) {
        switch (action) {
          case 'CREATE': {
            for (const product of response.value) {
              await consumeInventory(subdomain, product, 'create');
            }
            break;
          }
          case 'UPDATE': {
            for (const product of response.value) {
              await consumeInventory(subdomain, product, 'update');
            }
            break;
          }
          case 'DELETE': {
            for (const product of response.value) {
              await consumeInventory(subdomain, product, 'delete');
            }
            break;
          }
          default:
            break;
        }

        return {
          status: 'success'
        };
      }
    } catch (e) {
      console.log(e, 'error');
    }
  }
};

export default msdynamicMutations;
