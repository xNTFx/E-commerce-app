import express from "express";
import {
  getCartItems,
  addItemToCart,
  updateCart,
  deleteCartItem,
  deleteEntireCart,
} from "../controllers/cartController";

const router = express.Router();

router.get("/", getCartItems);
router.post("/addItemToCart", addItemToCart);
router.post("/updateCart", updateCart);
router.delete("/deleteCartItem", deleteCartItem);
router.delete("/deleteEntireCart", deleteEntireCart);

export default router;
