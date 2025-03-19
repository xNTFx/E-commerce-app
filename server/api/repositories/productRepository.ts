import { ProductsModel } from "../Models/Models";
import { ObjectId } from "mongodb";
import { Product } from "../types/productTypes";

export const getAllProductsFromDB = async (
  queryConditions: any,
  sortByValue: { [key: string]: 1 | -1 },
  limit?: number,
  offset?: number
): Promise<{ data: Product[]; totalCount: number }> => {
  try {
    const totalCount = await ProductsModel.countDocuments(queryConditions);
    const rawData = await ProductsModel.find(queryConditions)
      .limit(limit || 0)
      .skip(offset || 0)
      .sort(sortByValue)
      .lean<Product[]>();

    const data: Product[] = rawData.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    return { data, totalCount };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductByIdFromDB = async (
  id: string | ObjectId
): Promise<Product | null> => {
  try {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    const product = await ProductsModel.findOne({
      _id: objectId,
    }).lean<Product | null>();
    return product ? { ...product, _id: product._id.toString() } : null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getProductsByIdsFromDB = async (
  ids: (string | ObjectId)[]
): Promise<Product[]> => {
  try {
    const objectIds = ids.map((id) =>
      typeof id === "string" ? new ObjectId(id) : id
    );
    const rawData = await ProductsModel.find({ _id: { $in: objectIds } }).lean<
      Product[]
    >();
    return rawData.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching products by IDs:", error);
    throw error;
  }
};
