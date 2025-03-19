import { OrdersModel } from "../Models/Models";
import { Order } from "../types/orderTypes";

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  return OrdersModel.find({ userId }).lean();
};

export const createNewOrder = async (orderData: any): Promise<Order> => {
  const newOrder = new OrdersModel(orderData);
  await newOrder.save();
  return newOrder.toObject();
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  return OrdersModel.findById(orderId).lean();
};
