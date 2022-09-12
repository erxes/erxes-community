import { IContext } from '../../../connectionResolver';
import { sendProductsMessage } from '../../../messageBroker';
import { getConfig } from '../../../utils/utils';
import { sendRequest } from '@erxes/api-utils/src/requests';

const productsMutations = {
  async toSyncProducts(
    _root,
    { productCodes }: { productCodes: string[] },
    { productIds }: { productIds: string[] },
    { operation }: { operation: string },
    { subdomain }: IContext
  ) {
    const config = await getConfig(subdomain, 'ERKHET', {});

    if (!config.apiToken || !config.apiKey || !config.apiSecret) {
      throw new Error('Erkhet config not found.');
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

    // copy common fields between erkhet and erxes products
    result = result.map(item => {
      return {
        code: item.code,
        name: item.name,
        unitPrice: item.unit_price,
        categoryCode: item.category
      };
    });

    let matchedErkhetData = result.map(r => {
      if (productCodes.find(p => p === r.code)) {
        return r;
      }
    });

    let otherErkhetData = result.filter(r => !matchedErkhetData.includes(r));

    switch (operation) {
      case 'CREATE':
        // create unmatched data from product
        return await sendProductsMessage({
          subdomain,
          action: 'products.createProduct',
          data: { doc: { $in: otherErkhetData } },
          isRPC: true
        });
      case 'UPDATE':
        // update matched data from products
        return await sendProductsMessage({
          subdomain,
          action: 'products.updateProduct',
          data: { doc: { $in: matchedErkhetData }, ids: { $in: productIds } },
          isRPC: true
        });
      case 'DELETE':
        // delete matched data from product
        return await sendProductsMessage({
          subdomain,
          action: 'products.removeProducts',
          data: { ids: { $in: productIds } },
          isRPC: true
        });

      default:
        throw new Error('No operation found.');
    }
  },

  async toSyncCategories(
    _root,
    { categoryCodes }: { categoryCodes: string[] },
    { categoryIds }: { categoryIds: string[] },
    { operation }: { operation: string },
    { subdomain }: IContext
  ) {
    const config = await getConfig(subdomain, 'ERKHET', {});

    if (!config.apiToken || !config.apiKey || !config.apiSecret) {
      throw new Error('Erkhet config not found.');
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

    // copy common fields between erkhet and erxes categories
    result = result.map(item => {
      return {
        code: item.code,
        name: item.name,
        order: item.order,
        parent: item.parentId
      };
    });

    let matchedErkhetData = result.map(r => {
      if (categoryCodes.find(p => p === r.code)) {
        return r;
      }
    });

    let otherErkhetData = result.filter(r => !matchedErkhetData.includes(r));

    switch (operation) {
      case 'CREATE':
        // create unmatched data from category
        return await sendProductsMessage({
          subdomain,
          action: 'products:categories.createProductCategory',
          data: { doc: { $in: otherErkhetData } },
          isRPC: true
        });
      case 'UPDATE':
        // update matched data from category
        return await sendProductsMessage({
          subdomain,
          action: 'products:categories.updateProductCategory',
          data: { doc: { $in: matchedErkhetData }, id: { $in: categoryIds } },
          isRPC: true
        });
      case 'DELETE':
        // delete matched data from category
        return await sendProductsMessage({
          subdomain,
          action: 'products:categories.removeProductCategory',
          data: { ids: { $in: categoryIds } },
          isRPC: true
        });

      default:
        throw new Error('No operation found.');
    }
  }
};
export default productsMutations;
