import axios from 'axios';
import { isArray } from 'lodash';
import { QueryFunctionContext } from 'react-query';

import apiURL from './apiURL';

interface FetchProductsProps {
  page: number;
  price: number[];
  sortBy: string;
  categoryList: string[];
  pageItemsCount: number;
}

async function fetchProducts({
  page,
  price,
  sortBy,
  categoryList,
  pageItemsCount,
}: FetchProductsProps) {
  let baseURL = `${apiURL}/products?limit=${pageItemsCount}&offset=${
    page * pageItemsCount - pageItemsCount
  }&sortBy=${sortBy || ''}`;

  if (price && price[0] != null) {
    baseURL += `&minPrice=${price[0]}`;
  }
  if (price && price[1] != null) {
    baseURL += `&maxPrice=${price[1]}`;
  }
  if (categoryList && categoryList.length > 0) {
    baseURL += `&categoryList=${categoryList.join(',')}`;
  }

  const response = await fetch(baseURL);
  const { data: productList, totalCount } = await response.json();
  return { productList, totalCount };
}

async function fetchProductsFromCart(
  context: QueryFunctionContext<[string, { userId: string | null }]>,
) {
  const [, { userId }] = context.queryKey;
  if (!userId) return;
  const URL = `${apiURL}/cart?userId=${userId}`;
  const response = await fetch(URL);
  const data = await response.json();

  const modifiedData = isArray(data) ? data.reverse() : data;
  return modifiedData;
}

async function getProductsFromArray(ids: string[]) {
  if (ids.length === 0) return null;

  const URL = `${apiURL}/products/productsFromIdArray?ids=${ids}`;
  const response = await fetch(URL);
  const data = await response.json();

  return data;
}

async function getSingleProduct(
  context: QueryFunctionContext<[string, string | undefined]>,
) {
  const [, id] = context.queryKey;
  if (!id) return;
  const URL = `${apiURL}/products/singleProduct?id=${id}`;
  const response = await fetch(URL);
  const data = await response.json();
  return data;
}

async function getCategories() {
  const response = await fetch(`${apiURL}/categories`);
  const data = await response.json();
  return data;
}

async function getOrders(idToken: string | undefined | null) {
  if (!idToken) return;
  const response = await axios.get(`${apiURL}/orders/getOrders`, {
    params: { idToken: idToken },
  });

  return response.data;
}

async function getOrderDetails(orderId: string | undefined) {
  if (!orderId) return;
  const response = await axios.get(`${apiURL}/orders/getOrderDetails/${orderId}`);

  return response.data;
}

export {
  fetchProducts,
  fetchProductsFromCart,
  getProductsFromArray,
  getSingleProduct,
  getCategories,
  getOrders,
  getOrderDetails,
};
