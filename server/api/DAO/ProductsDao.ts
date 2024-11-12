import { ProductsModel } from "api/DTO/DTO";
import { ObjectId } from "mongodb";
import { SortOrder } from "mongoose";

interface QueryConditions {
  [key: string]: any;
}

export class ProductsDao {
  static async getAllProducts(
    queryConditions: QueryConditions,
    sortByValue: { [key: string]: SortOrder },
    limit: number,
    offset: number
  ) {
    try {
      const totalCount = await ProductsModel.countDocuments(queryConditions);
      const data = await ProductsModel.find(queryConditions)
        .limit(limit)
        .skip(offset)
        .sort(sortByValue);

      return { data, totalCount };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  static async getProductById(id: any) {
    try {
      return await ProductsModel.findOne({ _id: id });
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  static async getProductsByIds(ids: ObjectId[]) {
    try {
      return await ProductsModel.find({ _id: { $in: ids } });
    } catch (error) {
      console.error("Error fetching products by IDs:", error);
      throw error;
    }
  }
}
