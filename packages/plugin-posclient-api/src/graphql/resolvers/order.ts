import { IOrderDocument } from '../../models/definitions/orders';
import { sendContactsMessage } from '../../messageBroker';
import { IContext } from '../../connectionResolver';
import * as moment from 'moment';
import { IOrderItem } from '../../../../../../erxes-pos/ui/src/modules/checkout/types';

export default {
  async items(order: IOrderDocument, {}, { models }: IContext) {
    return await models.OrderItems.find({ orderId: order._id }).lean();
  },

  async customer(order: IOrderDocument, _params, { subdomain }: IContext) {
    if (!order.customerId) {
      return null;
    }

    return sendContactsMessage({
      subdomain,
      action: 'customers.findOne',
      data: { _id: order.customerId },
      isRPC: true
    });
  },

  user(order: IOrderDocument, {}, { models }: IContext) {
    return models.PosUsers.findOne({ _id: order.userId });
  },

  async putResponses(order: IOrderDocument, {}, { models }: IContext) {
    if (order.billType === '9') {
      const items: IOrderItem[] =
        (await models.OrderItems.find({ orderId: order._id }).lean()) || [];
      const products = await models.Products.find({
        _id: { $in: items.map(item => item.productId) }
      });
      const productById = {};
      for (const product of products) {
        productById[product._id] = product;
      }

      return [
        {
          contentType: 'pos',
          contentId: order._id,
          number: order.number,
          success: 'true',
          billId: '',
          date: moment(order.paidDate).format('yyyy-MM-dd hh:mm:ss'),
          macAddress: '',
          internalCode: '',
          billType: '9',
          lotteryWarningMsg: '',
          errorCode: '',
          message: '',
          getInformation: '',
          taxType: '1',
          qrData: '',
          lottery: '',
          sendInfo: {},
          status: '',
          stocks: items.map(item => ({
            code: productById[item.productId].code,
            name: productById[item.productId].name,
            measureUnit: productById[item.productId].sku || 'ш',
            qty: item.count,
            unitPrice: item.unitPrice,
            totalAmount: item.unitPrice * item.count,
            vat: '0.00',
            cityTax: '0.00',
            discount: item.discountAmount
          })),
          amount: order.totalAmount,
          vat: 0,
          cityTax: 0,
          cashAmount: order.cashAmount || 0,
          nonCashAmount: order.totalAmount - (order.cashAmount || 0),
          registerNo: '',
          customerNo: '',
          customerName: ''
        }
      ];
    }

    return models.PutResponses.find({
      contentType: 'pos',
      contentId: order._id,
      status: { $ne: 'inactive' }
    })
      .sort({ createdAt: -1 })
      .lean();
  }
};
