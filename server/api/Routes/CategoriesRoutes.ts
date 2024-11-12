import { CategoriesDao } from "api/DAO/CategoriesDao";
import express from "express";

const router = express.Router();

router.get("/categories", async (req, res) => {
  try {
    const result = await CategoriesDao.getAllCategories();
    res.send(result);
  } catch (e) {
    res.status(500).send("An error occurred while fetching products.");
  }
});

export default router;
