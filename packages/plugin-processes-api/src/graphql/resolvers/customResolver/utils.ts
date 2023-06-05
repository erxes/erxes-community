import { IProductsData } from '../../../models/definitions/jobs';
import { sendProductsMessage } from '../../../messageBroker';
import { IOverallProductsData } from '../../../models/definitions/overallWorks';

export const getProductsData = productsData => {
  const quantityByKey = {};
  const result: IOverallProductsData[] = [];

  for (const perProductsData of productsData) {
    for (const productData of perProductsData) {
      const key = `${productData.productId}_${productData.uom}`;
      if (!Object.keys(quantityByKey).includes(key)) {
        quantityByKey[key] = 0;
      }

      quantityByKey[key] = quantityByKey[key] + productData.quantity;
    }
  }

  for (const key of Object.keys(quantityByKey)) {
    const [productId, uom] = key.split('_');
    result.push({
      productId,
      uom,
      quantity: quantityByKey[key]
    });
  }
  return result;
};

export const getProductAndUoms = async (
  subdomain: string,
  productsData: IProductsData[]
) => {
  const productById = {};
  const uomById = {};

  if (!productsData || !productsData.length) {
    return { productById, uomById };
  }

  const productIds = productsData
    .filter(n => n.productId)
    .map(n => n.productId);

  if (productIds.length) {
    const products = await sendProductsMessage({
      subdomain,
      action: 'find',
      data: { query: { _id: { $in: productIds } } },
      isRPC: true,
      defaultValue: []
    });

    for (const product of products) {
      productById[product._id] = product;
    }
  }

  const uoms = productsData.map(n => n.uom);

  if (uoms.length) {
    const uoms = await sendProductsMessage({
      subdomain,
      action: 'uoms.find',
      data: { _id: { $in: uoms } },
      isRPC: true,
      defaultValue: []
    });

    for (const uom of uoms) {
      uomById[uom._id] = uom;
    }
  }

  return { productById, uomById };
};
