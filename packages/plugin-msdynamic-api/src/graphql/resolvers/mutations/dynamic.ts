import { sendRequest } from '@erxes/api-utils/src';
import { IContext } from '../../../messageBroker';

const msdynamicMutations = {
  /**
   * Creates a new msdynamic
   */
  async msdynamicConfigs(_root, doc, { models }: IContext) {
    return await models.Msdynamics.createMsdynamicConfig(doc);
  },
  /**
   * Edits a new msdynamic
   */
  async msdynamicEditConfigs(_root, doc, { models, user }: IContext) {
    return await models.Msdynamics.updateMsdynamicConfig(doc, user);
  },

  async msdynamicsAdd(_root, doc, { models }: IContext) {
    // const dynamic = await models.Msdynamics.createMsdynamic(doc);
    const end =
      "https://bc.erpmsm.mn:7048/MSM-DATA/ODataV4/Company('ZZBETA0529-DEV')/Item_Card_Api";

    const username = `MSM\\msmit`;
    const password = 'Tsonh$2h@@';

    try {
      const response = await sendRequest({
        url: end,
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
