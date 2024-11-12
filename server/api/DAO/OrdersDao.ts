import { OrdersModel } from "api/DTO/DTO";

export class OrdersDao {
  static async getOrders(userId: string) {
    try {
      return await OrdersModel.find({ userId: userId });
    } catch (e) {
      throw e;
    }
  }

  static async createOrder(orderData: any) {
    try {
      const newOrder = new OrdersModel(orderData);
      await newOrder.save();
      return newOrder;
    } catch (e) {
      throw e;
    }
  }

  static async getOrderById(orderId: string) {
    try {
      return await OrdersModel.findById(orderId);
    } catch (error) {
      throw error;
    }
  }
}
