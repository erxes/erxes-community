import { IContext } from '../../../connectionResolver';
import { sendProductsMessage } from '../../../messageBroker';
import { IRemainderDocument } from '../../../models/definitions/remainders';

export default {
  async uom(product: any, _, { subdomain }: IContext) {
    if (!product.uom) {
      return product.sku;
    }

    return await sendProductsMessage({
      subdomain,
      action: 'uoms.findOne',
      data: { _id: product.uom },
      isRPC: true
    });
  },

  async category(remainder: any, _, { subdomain }: IContext) {
    return sendProductsMessage({
      subdomain,
      action: 'categories.findOne',
      data: {
        _id: remainder.categoryId
      },
      isRPC: true
    });
  }
};
