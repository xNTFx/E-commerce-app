import { verifyIdToken } from "../utils/Auth";
import * as cartRepository from "../repositories/cartRepository";
import { CartItem } from "../types/cartTypes";

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  const decodedUserId = await verifyIdToken(userId);
  return cartRepository.getCartItems(decodedUserId);
};

export const addItemToCart = async (
  userId: string,
  productId: string,
  count: number
) => {
  const decodedUserId = await verifyIdToken(userId);
  return cartRepository.addOrUpdateCartItem(decodedUserId, productId, count);
};

export const updateCart = async (
  userId: string,
  productId: string,
  count: number
) => {
  const decodedUserId = await verifyIdToken(userId);
  return cartRepository.updateCartItem(decodedUserId, productId, count);
};

export const deleteCartItem = async (userId: string, cartId: string) => {
  const decodedUserId = await verifyIdToken(userId);
  return cartRepository.deleteCartItem(decodedUserId, cartId);
};

export const deleteEntireCart = async (userId: string) => {
  const decodedUserId = await verifyIdToken(userId);
  return cartRepository.deleteAllCartItems(decodedUserId);
};
