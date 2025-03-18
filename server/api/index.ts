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

const allowedOrigins =
  process.env.NODE_ENV === "development"
    ? [
        "http://localhost:5173",
        "https://e-commerce-app.pawelsobon.pl",
        "https://www.e-commerce-app.pawelsobon.pl",
      ]
    : [
        "https://e-commerce-app.pawelsobon.pl",
        "https://www.e-commerce-app.pawelsobon.pl",
      ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Unauthorized origin"));
      }
    },
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGODB_URI || "", { dbName: "e-commerce" })
  .then(() => console.info("MongoDB connection established"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/products", ProductsRoutes);
app.use("/cart", CartItemsRoutes);
app.use("/categories", CategoriesRoutes);
app.use("/orders", OrdersRoutes);
setupPaymentRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.info(`Server running on port ${PORT}`));
