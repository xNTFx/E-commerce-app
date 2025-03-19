import {
  getAllProductsFromDB,
  getProductByIdFromDB,
  getProductsByIdsFromDB,
} from "../repositories/productRepository";

import { ObjectId } from "mongodb";

export const fetchAllProducts = async (query: any) => {
  const { limit, offset, minPrice, maxPrice, sortBy, categoryList } = query;

  const category = categoryList?.split(",");
  let queryConditions: { [key: string]: any } = {};
  let sortByValue: { [key: string]: 1 | -1 } = { id: 1 };

  if (minPrice && maxPrice) {
    queryConditions.price = {
      $gt: parseFloat(minPrice),
      $lt: parseFloat(maxPrice),
    };
  }

  if (categoryList && category && category.length > 0) {
    queryConditions.category = { $in: category };
  }

  switch (sortBy) {
    case "price-desc":
      sortByValue = { price: -1 };
      break;
    case "price-asc":
      sortByValue = { price: 1 };
      break;
    case "name-az":
      sortByValue = { title: 1 };
      break;
    case "name-za":
      sortByValue = { title: -1 };
      break;
    default:
      sortByValue = { id: 1 };
  }

  const parsedLimit = limit ? parseInt(limit, 10) : undefined;
  const parsedOffset = offset ? parseInt(offset, 10) : undefined;

  return getAllProductsFromDB(
    queryConditions,
    sortByValue,
    parsedLimit,
    parsedOffset
  );
};

export const fetchProductById = async (id: string) => {
  return getProductByIdFromDB(new ObjectId(id));
};

export const fetchProductsByIds = async (ids: string) => {
  const idsList = ids?.split(",").map((id) => new ObjectId(id));
  return getProductsByIdsFromDB(idsList);
};
