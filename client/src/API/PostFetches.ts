import axios from 'axios';

import {
  CartItemsType,
  CreateOrderType,
  UpdateCartType,
} from '../types/APITypes';
import getIdTokenFunction from '../utils/getIdTokenFunction';
import apiURL from './apiURL';

async function updateCartApi(newCart: UpdateCartType) {
  const URL = `${apiURL}`;
  const data = await axios.post(URL + '/cart/updateCart', newCart);
  return data;
}

async function addProduct(newProduct: CartItemsType) {
  if (!newProduct.userId || !newProduct.productId || !newProduct.count) return;
  const URL = `${apiURL}`;
  const data = await axios.post(URL + '/cart/addItemToCart', newProduct);

  return data;
}

async function addProductsToCart(products: string[]) {
  if (!products || products.length === 0) return;
  const URL = `${apiURL}/cart/addOrUpdateItemsInCart`;
  const idToken = await getIdTokenFunction();
  const data = await axios.post(URL, {
    userId: idToken,
    items: products,
  });
  return data;
}

async function createOrder(
  state: CreateOrderType,
  idToken: string | undefined,
) {
  const data = await axios.post(`${apiURL}/orders/createOrder`, {
    idToken: idToken,
    state: state,
  });

  return data;
}

export { updateCartApi, addProduct, addProductsToCart, createOrder };
