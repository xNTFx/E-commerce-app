import { Request, Response } from "express";
import { fetchAllCategories } from "../services/categoryService";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await fetchAllCategories();
    res.send(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("An error occurred while fetching categories.");
  }
};
