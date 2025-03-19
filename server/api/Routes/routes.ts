import express from "express";
import ProductsRoutes from "./productsRoutes";
import CartItemsRoutes from "./cartRoutes";
import CategoriesRoutes from "./categoriesRoutes";
import OrdersRoutes from "./ordersRoutes";

const router = express.Router();

router.use("/products", ProductsRoutes);
router.use("/cart", CartItemsRoutes);
router.use("/categories", CategoriesRoutes);
router.use("/orders", OrdersRoutes);

export default router;
