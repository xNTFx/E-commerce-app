import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import setupPaymentRoutes from "./payment.js";
import ProductsRoutes from "../api/Routes/ProductsRoutes.js";
import CartItemsRoutes from "../api/Routes/CartItemsRoutes.js";
import CategoriesRoutes from "./Routes/CategoriesRoutes.js";
import OrdersRoutes from "./Routes/OrdersRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI || "", { dbName: "e-commerce" })
  .then(() => console.info("MongoDB connection established"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(ProductsRoutes);
app.use(CartItemsRoutes);
app.use(CategoriesRoutes);
app.use(OrdersRoutes);
setupPaymentRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.info(`Server running on port ${PORT}`));
