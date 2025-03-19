import { Request, Response } from "express";
import {
  fetchAllProducts,
  fetchProductById,
  fetchProductsByIds,
} from "../services/productService";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await fetchAllProducts(req.query);
    res.send(products);
  } catch (err) {
    res.status(500).send("an error occurred while fetching products.");
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query as { id: string };
    const data = await fetchProductById(id);
    if (!data) {
      return res.status(404).send("product not found");
    }
    res.send(data);
  } catch (err) {
    res.status(500).send("an error occurred while fetching the product.");
  }
};

export const getProductsByIds = async (req: Request, res: Response) => {
  try {
    const { ids } = req.query as { ids: string };
    const data = await fetchProductsByIds(ids);
    res.send(data);
  } catch (err) {
    res.status(500).send("an error occurred while fetching products.");
  }
};
