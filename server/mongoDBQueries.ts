import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import admin from "firebase-admin";
import express from "express";
import { addOrUpdateItemsType, QueryConditions, SortOptions } from "./types.js";

export default function mongoDBQueries(app: express.Application) {
  const mongoUri = process.env.MONGODB_URI!

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID,
      privateKey: process.env.PRIVATE_KEY!.replace(/\\n/g, "\n"),
      clientEmail: process.env.CLIENT_EMAIL,
    }),
  });

  app.get("/ma", (req, res) => {
    res.send("Hello, World ma!");
  });

  async function verifyIdToken(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken.user_id;
    } catch (error) {
      console.error("Error verifying ID token:", error);
      throw error;
    }
  }

  mongoose
    .connect(mongoUri, { dbName: "e-commerce" })
    .then(() => console.log("MongoDB connection established"))
    .catch((err) => console.error("MongoDB connection error:", err));

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

  const CartItemsSchema = new mongoose.Schema({
    _id: ObjectId,
    userId: String,
    count: Number,
    productId: ObjectId,
  });
  const ProductsModel = mongoose.model("products", ProductsSchema);
  const CartItemsModel = mongoose.model("cart_items", CartItemsSchema);

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

  app.get("/singleProduct", async (req, res) => {
    try {
      const { id } = req.query;

      const nid = new ObjectId(id as string);
      const data = await ProductsModel.findOne({ _id: nid });
      if (!data) {
        return res.status(404).send("Product not found");
      }
      res.send(data);
    } catch (err) {
      console.error("Error fetching product:", err);
      res.status(500).send("An error occurred while fetching the product.");
    }
  });

  app.get("/productsFromIdArray", async (req, res) => {
    try {
      const { ids } = req.query;
      const idsList = (ids as string)?.split(",");

      const nids = idsList.map((id) => new ObjectId(id));
      const data = await ProductsModel.find({ _id: { $in: nids } });
      if (!data) {
        return res.status(404).send("Product not found");
      }
      res.send(data);
    } catch (err) {
      console.error("Error fetching product:", err);
      res.status(500).send("An error occurred while fetching the product.");
    }
  });

  app.get("/cart", async (req, res) => {
    try {
      const { userId } = req.query;

      const decodedUserId = await verifyIdToken(userId as string);

      const cartItems = await CartItemsModel.aggregate([
        {
          $match: {
            userId: decodedUserId,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
      ]);

      res.send(cartItems);
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).send("An error occurred while fetching products.");
    }
  });

  app.post("/add-or-update-item-in-cart", async (req, res) => {
    try {
      const { userId, productId, count } = req.body;
      const decodedUserId = await verifyIdToken(userId);
      if (!decodedUserId) {
        res
          .status(500)
          .send("An error occurred while retrieving a firebase id.");
      }

      const existingCartItem = await CartItemsModel.findOne({
        userId: decodedUserId,
        productId: new ObjectId(productId),
      });

      if (existingCartItem) {
        existingCartItem.count += count;
        await existingCartItem.save();
        res.status(200).send({
          message: "Cart item updated successfully",
          item: existingCartItem,
        });
      } else {
        const newCartItem = await CartItemsModel.create({
          _id: new ObjectId(),
          userId: decodedUserId,
          productId,
          count,
        });
        res
          .status(201)
          .send({ message: "Cart item added successfully", item: newCartItem });
      }
    } catch (error) {
      console.error("Error adding/updating cart item:", error);
      res
        .status(500)
        .send("An error occurred while adding/updating the item in the cart.");
    }
  });

  app.post("/add-or-update-items-in-cart", async (req, res) => {
    try {
      const { userId, items } = req.body;
      const decodedUserId = await verifyIdToken(userId);
      if (!decodedUserId) {
        return res
          .status(500)
          .send("An error occurred while retrieving a firebase id.");
      }

      const updatePromises = items.map(async (item: addOrUpdateItemsType) => {
        const { productId, count } = item;
        const existingCartItem = await CartItemsModel.findOne({
          userId: decodedUserId,
          productId: new ObjectId(productId),
        });

        if (existingCartItem && existingCartItem.count) {
          existingCartItem.count += count;
          return existingCartItem.save();
        } else {
          return CartItemsModel.create({
            _id: new ObjectId(),
            userId: decodedUserId,
            productId,
            count,
          });
        }
      });

      const results = await Promise.all(updatePromises);
      res.status(200).send({
        message: "Cart items processed successfully",
        items: results,
      });
    } catch (error) {
      console.error("Error processing cart items:", error);
      res
        .status(500)
        .send("An error occurred while processing the items in the cart.");
    }
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });

  app.post("/updateCart", async (req, res) => {
    try {
      const { userId, cartId, newCount } = req.body;

      const decodedUserId = await verifyIdToken(userId);

      const existingCartItem = await CartItemsModel.findOne({
        userId: decodedUserId,
        _id: new ObjectId(cartId),
      });
      if (existingCartItem) {
        existingCartItem.count = newCount;
        await existingCartItem.save();
      }

      res.status(201).send({
        message: "Cart item updated successfully",
        item: { userId, cartId, newCount },
      });
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).send("An error occurred while fetching products.");
    }
  });

  app.delete("/deleteCart", async (req, res) => {
    try {
      const { userId, cartId } = req.body;

      const decodedUserId = await verifyIdToken(userId);

      const result = await CartItemsModel.deleteOne({
        userId: decodedUserId,
        _id: new ObjectId(cartId),
      });

      res.status(200).send("Cart item deleted successfully.");
    } catch (err) {
      console.error("Error deleting cart item:", err);
      res.status(500).send("An error occurred while deleting the cart item.");
    }
  });

  app.delete("/deleteEntireCart", async (req, res) => {
    try {
      const { userId } = req.body;

      const decodedUserId = await verifyIdToken(userId);

      const result = await CartItemsModel.deleteMany({
        userId: decodedUserId,
      });

      res.status(200).send("Cart item deleted successfully.");
    } catch (err) {
      console.error("Error deleting cart item:", err);
      res.status(500).send("An error occurred while deleting the cart item.");
    }
  });
}
