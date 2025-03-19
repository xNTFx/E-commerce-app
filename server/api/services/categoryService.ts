import { getCategories } from "../repositories/categoryRepository";

export const fetchAllCategories = async () => {
  return getCategories();
};
