import { sendRequest } from '@erxes/api-utils/src/requests';
import { IContext } from '../../../connectionResolver';
import { arrayPaginate, getConfig } from '../../../utils/utils';

const erkhetQueries = {
  async getCategoriesErkhet(
    _root,
    {
      page,
      perPage
    }: {
      page: number;
      perPage: number;
    },
    { subdomain }: IContext
  ) {
    const config = await getConfig(subdomain, 'ERKHET', {});

    if (!config.apiToken || !config.apiKey || !config.apiSecret) {
      throw new Error('Erkhet config not found');
    }

    const response = await sendRequest({
      url: 'https://erkhet.biz/get-api/',
      method: 'GET',
      params: {
        kind: 'inv_category',
        api_key: config.apiKey,
        api_secret: config.apiSecret
      }
    });
    const result = JSON.parse(response).map(r => r.fields);
    return arrayPaginate(result, perPage, page);
  },
  async getProductsErkhet(
    _root,
    {
      page,
      perPage
    }: {
      page: number;
      perPage: number;
    },
    { subdomain }: IContext
  ) {
    const config = await getConfig(subdomain, 'ERKHET', {});

    if (!config.apiToken || !config.apiKey || !config.apiSecret) {
      throw new Error('Erkhet config not found');
    }
    const response = await sendRequest({
      url: 'https://erkhet.biz/get-api/',
      method: 'GET',
      params: {
        kind: 'inventory',
        api_key: config.apiKey,
        api_secret: config.apiSecret
      }
    });
    const result = JSON.parse(response).map(r => r.fields);
    return arrayPaginate(result, perPage, page);
  }
};
export default erkhetQueries;
