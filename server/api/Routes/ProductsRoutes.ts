import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductsByIds,
} from "../controllers/productController";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/singleProduct", getProductById);
router.get("/productsFromIdArray", getProductsByIds);

export default router;
