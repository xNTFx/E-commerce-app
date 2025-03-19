import { CategoriesModel } from "../Models/Models";
import { Category } from "../types/categoryTypes";

export const getCategories = async (): Promise<Category[]> => {
  return CategoriesModel.find({});
};
