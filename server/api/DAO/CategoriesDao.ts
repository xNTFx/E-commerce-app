import { CategoriesModel } from "api/DTO/DTO";

export class CategoriesDao {
  static async getAllCategories() {
    try {
      const data = await CategoriesModel.find();
      return data;
    } catch (e) {
      throw e;
    }
  }
}
