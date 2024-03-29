import { Model, model } from 'mongoose';
import { IOrder, IOrderDocument, orderSchema } from './definitions/orders';

export interface IOrderModel extends Model<IOrderDocument> {
  getOrder(_id: string): Promise<IOrderDocument>;
  createOrder(doc: IOrder): Promise<IOrderDocument>;
  updateOrder(_id: string, doc: IOrder): Promise<IOrderDocument>;
  getPaidAmount(order: IOrderDocument): number;
}

export const loadOrderClass = models => {
  class Order {
    public static async getOrder(_id: string) {
      const order = await models.Orders.findOne({ _id }).lean();

      if (!order) {
        throw new Error(`Order not found with id: ${_id}`);
      }

      return order;
    }

    public static createOrder(doc: IOrder) {
      const now = new Date();
      return models.Orders.create({ ...doc, modifiedAt: now, createdAt: now });
    }

    public static async updateOrder(_id: string, doc: IOrder) {
      await models.Orders.updateOne(
        { _id },
        { $set: { ...doc, modifiedAt: new Date() } }
      );

      return models.Orders.findOne({ _id });
    }

    public static getPaidAmount(order: IOrderDocument) {
      return (
        (order.cashAmount || 0) +
        (order.mobileAmount || 0) +
        (order.paidAmounts || []).reduce(
          (sum, i) => Number(sum) + Number(i.amount),
          0
        )
      );
    }
  }

  orderSchema.loadClass(Order);
  return orderSchema;
};
