import { sendPricingMessage } from '../../messageBroker';
import { IConfigDocument } from '../../models/definitions/configs';
import { IOrderInput } from '../types';

export const checkPricing = async (
  subdomain: string,
  doc: IOrderInput,
  config: IConfigDocument
) => {
  let pricing: any = {};

  try {
    pricing = await sendPricingMessage({
      subdomain,
      action: 'checkPricing',
      data: {
        totalAmount: doc.totalAmount,
        departmentId: config.departmentId,
        branchId: config.branchId,
        products: [
          ...doc.items.map(i => ({
            productId: i.productId,
            quantity: i.count,
            price: i.unitPrice,
            manufacturedDate: '1669852' // i.manufacturedDate,
          }))
        ]
      },
      isRPC: true,
      defaultValue: {}
    });
  } catch (e) {
    console.log(e.message);
  }

  console.log('PRICING', pricing);

  for (const item of doc.items || []) {
    const discount = pricing[item.productId];

    if (discount) {
      if (discount.type.length === 0) continue;

      if (discount.type !== 'bonus') item.discountAmount = discount.value;

      // adds bonus product
    }
  }

  return doc;
};
