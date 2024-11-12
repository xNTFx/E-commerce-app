import { ProductsDao } from "api/DAO/ProductsDao";
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { SortOrder } from "mongoose";

const router = express.Router();

interface QueryParams {
  limit?: string;
  offset?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  categoryList?: string;
}

router.get("/products", async (req: Request, res: Response) => {
  try {
    const { limit, offset, minPrice, maxPrice, sortBy, categoryList } =
      req.query as QueryParams;

    const category = categoryList?.split(",");
    let queryConditions: { [key: string]: any } = {};
    let sortByValue: { [key: string]: SortOrder } = { id: 1 };

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
        sortByValue = { price: -1 as SortOrder };
        break;
      case "price-asc":
        sortByValue = { price: 1 as SortOrder };
        break;
      case "name-az":
        sortByValue = { title: 1 as SortOrder };
        break;
      case "name-za":
        sortByValue = { title: -1 as SortOrder };
        break;
      default:
        sortByValue = { id: 1 as SortOrder };
    }

    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    const parsedOffset = offset ? parseInt(offset, 10) : undefined;

    const result = await ProductsDao.getAllProducts(
      queryConditions,
      sortByValue,
      Number(parsedLimit),
      Number(parsedOffset)
    );
    res.send(result);
  } catch (err) {
    res.status(500).send("An error occurred while fetching products.");
  }
});

router.get("/singleProduct", async (req: Request, res: Response) => {
  try {
    const { id } = req.query as { id: string };
    const data = await ProductsDao.getProductById(new ObjectId(id));
    if (!data) {
      return res.status(404).send("Product not found");
    }
    res.send(data);
  } catch (err) {
    res.status(500).send("An error occurred while fetching the product.");
  }
});

router.get("/productsFromIdArray", async (req: Request, res: Response) => {
  try {
    const { ids } = req.query as { ids: string };
    const idsList = ids?.split(",").map((id) => new ObjectId(id));
    const data = await ProductsDao.getProductsByIds(idsList);
    res.send(data);
  } catch (err) {
    res.status(500).send("An error occurred while fetching products.");
  }
});

export default router;
