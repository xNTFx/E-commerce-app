import express from "express";
import {
  getOrders,
  createOrder,
  getOrderDetails,
} from "../controllers/orderController";

const router = express.Router();

router.get("/getOrders", getOrders);
router.post("/createOrder", createOrder);
router.get("/getOrderDetails/:orderId", getOrderDetails);

export default router;
