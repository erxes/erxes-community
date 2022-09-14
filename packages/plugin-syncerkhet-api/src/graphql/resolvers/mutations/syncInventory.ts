import { IContext } from '../../../connectionResolver';
import { getConfig } from '../../../utils/utils';
import { sendRequest } from '@erxes/api-utils/src/requests';
import { sendProductsMessage } from '../../../messageBroker';

const inventoryMutations = {
  async toCheckProducts(
    _root,
    { productCodes }: { productCodes: string[] },
    { subdomain }: IContext
  ) {
    const config = await getConfig(subdomain, 'ERKHET', {});

    if (!config.apiToken || !config.apiKey || !config.apiSecret) {
      throw new Error('Erkhet config not found.');
    }

    if (!productCodes) {
      throw new Error('No product codes found.');
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

    if (!response.length) {
      throw new Error('Erkhet data not found.');
    }
    let result = JSON.parse(response).map(r => r.fields);

    result = result.map(item => {
      return {
        code: item.code,
        name: item.name,
        unitPrice: item.unit_price,
        categoryCode: item.category
      };
    });

    const matchedErkhetData = result.filter(r => {
      if (productCodes.find(p => p === r.code)) {
        return r;
      }
    });
    const otherErkhetData = result.filter(r => !matchedErkhetData.includes(r));

    let otherProducts: any[] = [];
    for (const code of productCodes) {
      if (result.every(r => r.code !== code)) {
        const response = await sendProductsMessage({
          subdomain,
          action: 'findOne',
          data: { code: code },
          isRPC: true
        });
        otherProducts.push(response);
      }
    }

    return {
      create: {
        count: otherErkhetData.length,
        items: otherErkhetData
      },
      update: {
        count: matchedErkhetData.length,
        items: matchedErkhetData
      },
      delete: {
        count: otherProducts.length,
        items: otherProducts
      }
    };
  },
  async toCheckCategories(
    _root,
    { categoryCodes }: { categoryCodes: string[] },
    { subdomain }: IContext
  ) {
    const config = await getConfig(subdomain, 'ERKHET', {});

    if (!config.apiToken || !config.apiKey || !config.apiSecret) {
      throw new Error('Erkhet config not found.');
    }

    if (!categoryCodes) {
      throw new Error('No category codes found.');
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

    if (!response.length) {
      throw new Error('Erkhet data not found.');
    }
    let result = JSON.parse(response).map(r => r.fields);

    result = result.map(item => {
      return {
        code: item.code,
        name: item.name,
        unitPrice: item.unit_price,
        categoryCode: item.category
      };
    });

    // for update
    const matchedErkhetData = result.filter(r => {
      if (categoryCodes.find(p => p === r.code)) {
        return r;
      }
    });
    // for create
    const otherErkhetData = result.filter(r => !matchedErkhetData.includes(r));
    // for delete
    let otherCategories: any[] = [];
    for (const code of categoryCodes) {
      if (result.every(r => r.code !== code)) {
        const response = await sendProductsMessage({
          subdomain,
          action: 'categories.findOne',
          data: { code: code },
          isRPC: true
        });
        otherCategories.push(response);
      }
    }
    return {
      create: {
        count: otherErkhetData.length,
        items: otherErkhetData
      },
      update: {
        count: matchedErkhetData.length,
        items: matchedErkhetData
      },
      delete: {
        count: otherCategories.length,
        items: otherCategories
      }
    };
  }
};
export default inventoryMutations;
