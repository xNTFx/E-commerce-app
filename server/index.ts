import express from "express";
import cors from "cors";
import setupPaymentRoutes from "./payment.js";
import mongoDB from "./mongoDBQueries.js";
import helmet from "helmet";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { QueryConditions, SortOptions } from "types.js";

const app = express();

const corsOptions = {
  origin: "https://shopping-page-client.vercel.app",
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
        connectSrc: ["'self'", "https://api.example.com"],
        imgSrc: ["'self'", "data:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

app.options("*", cors(corsOptions));

mongoDB(app);
setupPaymentRoutes(app);

const ProductsSchema = new mongoose.Schema({
  _id: ObjectId,
  id: Number,
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  rating: Number,
  stock: Number,
  brand: String,
  category: String,
  thumbnail: String,
  images: [String],
});
const ProductsModel = mongoose.model("products", ProductsSchema);

app.get("/products", async (req, res) => {
  try {
    const { limit, offset, minPrice, maxPrice, sortBy, categoryList } =
      req.query;

    const category = (categoryList as string | undefined)?.split(",");
    let queryConditions: QueryConditions = {};
    let sortByValue: SortOptions = { id: 1 };
    if (minPrice && maxPrice) {
      queryConditions.price = {
        $gt: parseFloat(minPrice as string),
        $lt: parseFloat(maxPrice as string),
      };
    }

    if (categoryList && category && category?.length > 0) {
      queryConditions.category = { $in: category };
    }

    switch (sortBy) {
      case "price-desc":
        sortByValue = { price: -1 };
        break;
      case "price-asc":
        sortByValue = { price: 1 };
        break;
      case "name-az":
        sortByValue = { title: 1 };
        break;
      case "name-za":
        sortByValue = { title: -1 };
        break;
      default:
        sortByValue = { id: 1 };
    }

    const parsedLimit = parseInt(limit as string, 10);
    const parsedOffset = parseInt(offset as string, 10);

    const totalCount = await ProductsModel.countDocuments(queryConditions);
    const data = await ProductsModel.find(queryConditions)
      .limit(parsedLimit)
      .skip(parsedOffset)
      .sort(sortByValue);

    res.send({ data, totalCount });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("An error occurred while fetching products.");
  }
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
