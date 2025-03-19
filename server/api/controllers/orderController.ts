import { Request, Response } from "express";
import {
  fetchOrders,
  processOrderCreation,
  fetchOrderDetails,
} from "../services/orderService";
import { OrderData } from "api/types/orderTypes";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.query;
    if (!idToken) {
      return res.status(400).send("IdToken is required.");
    }

    const orders = await fetchOrders(idToken.toString());
    res.status(200).json(orders);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({ message: "Failed to retrieve orders", error });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {

    const { idToken, state } = req.body;
    if (!state) {
      console.error("Missing 'state' field in request body.");
      return res
        .status(400)
        .json({ error: "Invalid order data. Missing 'state' field." });
    }

    const orderData: OrderData = state.state
      ? { ...state.state }
      : { ...state };

    const newOrder = await processOrderCreation(idToken, orderData);

    if ("error" in newOrder) {
      return res.status(400).json(newOrder);
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const orderDetails = await fetchOrderDetails(orderId);

    if (!orderDetails) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(orderDetails);
  } catch (error) {
    console.error((error as Error).message);
    res
      .status(500)
      .json({ message: "Failed to retrieve order details", error });
  }
};
