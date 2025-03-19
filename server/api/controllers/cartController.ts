import { Request, Response } from "express";
import * as cartService from "../services/cartService";

export const getCartItems = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      return res.status(400).send("Invalid or missing userId");
    }

    const cartItems = await cartService.getCartItems(userId);
    res.send(cartItems);
  } catch (err) {
    res.status(500).send("Error fetching cart items.");
  }
};

export const addItemToCart = async (req: Request, res: Response) => {
  try {
    const { userId, productId, count } = req.body;
    const updatedCartItem = await cartService.addItemToCart(
      userId,
      productId,
      count
    );
    res.status(200).send(updatedCartItem);
  } catch (error) {
    res.status(500).send("Error updating the cart.");
  }
};

export const updateCart = async (req: Request, res: Response) => {
  try {
    const { userId, productId, count } = req.body;
    const updatedCartItem = await cartService.updateCart(
      userId,
      productId,
      count
    );
    res.status(200).send(updatedCartItem);
  } catch (error) {
    res.status(500).send("Error updating the cart.");
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const { userId, cartId } = req.body;
    await cartService.deleteCartItem(userId, cartId);
    res.status(200).send("Cart item deleted successfully.");
  } catch (err) {
    res.status(500).send("Error deleting the cart item.");
  }
};

export const deleteEntireCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    await cartService.deleteEntireCart(userId);
    res.status(200).send("All cart items deleted successfully.");
  } catch (err) {
    res.status(500).send("Error deleting all cart items.");
  }
};
