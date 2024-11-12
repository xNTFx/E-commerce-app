import express from "express";
import { verifyIdToken } from "../utils/Auth";
import { CartItemsDao } from "api/DAO/CartItemsDao.js";
import { CartItemsModel } from "api/DTO/DTO";

const router = express.Router();

router.get("/cart", async (req, res) => {
  try {
    const { userId } = req.query;

    if (typeof userId !== "string") {
      return res.status(400).send("Invalid or missing userId");
    }

    const decodedUserId = await verifyIdToken(userId);
    if (!decodedUserId) {
      return res
        .status(500)
        .send("An error occurred while verifying the user ID.");
    }

    const cartItems = await CartItemsDao.getCartItems(decodedUserId);

    res.send(cartItems);
  } catch (err) {
    console.error("Error fetching cart items:", err);
    res.status(500).send("An error occurred while fetching cart items.");
  }
});

router.post("/addItemToCart", async (req, res) => {
  try {
    const { userId, productId, count } = req.body;

    const decodedUserId = await verifyIdToken(userId);
    if (!decodedUserId) {
      return res
        .status(500)
        .send("An error occurred while retrieving a firebase id.");
    }

    const existingCartItem = await CartItemsModel.findOne({
      userId: decodedUserId,
      productId: productId,
    });

    if (existingCartItem) {
      existingCartItem.count += count;
      await existingCartItem.save();
      return res.status(200).send({
        message: "Cart item updated successfully",
        item: existingCartItem,
      });
    } else {
      const newCartItem = await CartItemsModel.create({
        userId: decodedUserId,
        productId: productId,
        count,
      });
      return res.status(201).send({
        message: "Cart item added successfully",
        item: newCartItem,
      });
    }
  } catch (error) {
    console.error("Error adding/updating cart item:", error);
    return res
      .status(500)
      .send("An error occurred while adding/updating the item in the cart.");
  }
});

router.post("/updateCart", async (req, res) => {
  try {
    const { userId, productId, count } = req.body;

    const decodedUserId = await verifyIdToken(userId);
    if (!decodedUserId) {
      return res
        .status(500)
        .send("An error occurred while retrieving a firebase id.");
    }

    const existingCartItem = await CartItemsModel.findOne({
      userId: decodedUserId,
      productId: productId,
    });

    if (existingCartItem) {
      existingCartItem.count = count;
      await existingCartItem.save();
      return res.status(200).send({
        message: "Cart item updated successfully",
        item: existingCartItem,
      });
    } else {
      const newCartItem = await CartItemsModel.create({
        userId: decodedUserId,
        productId: productId,
        count,
      });
      return res.status(201).send({
        message: "Cart item added successfully",
        item: newCartItem,
      });
    }
  } catch (error) {
    console.error("Error adding/updating cart item:", error);
    return res
      .status(500)
      .send("An error occurred while adding/updating the item in the cart.");
  }
});

router.delete("/deleteCartItem", async (req, res) => {
  try {
    const { userId, cartId } = req.body;
    const decodedUserId = await verifyIdToken(userId);
    await CartItemsDao.deleteCartItem(decodedUserId, cartId);
    res.status(200).send("Cart item deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while deleting the cart item.");
  }
});

router.delete("/deleteEntireCart", async (req, res) => {
  try {
    const { userId } = req.body;
    const decodedUserId = await verifyIdToken(userId);
    await CartItemsDao.deleteAllCartItems(decodedUserId);
    res.status(200).send("All cart items deleted successfully.");
  } catch (err) {
    res.status(500).send("An error occurred while deleting all cart items.");
  }
});

export default router;
