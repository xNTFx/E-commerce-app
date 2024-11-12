import { CartItemsDao } from "api/DAO/CartItemsDao";
import { OrdersDao } from "api/DAO/OrdersDao";
import { ProductsDao } from "api/DAO/ProductsDao";
import { ProductsModel } from "api/DTO/DTO";
import { verifyIdToken } from "api/utils/Auth";
import express from "express";

const router = express.Router();

router.get("/getOrders", async (req, res) => {
  try {
    const { idToken } = req.query;

    if (!idToken) {
      return res.status(500).send("IdToken is required.");
    }

    const decodedUserId = await verifyIdToken(idToken.toString());
    if (!decodedUserId) {
      return res
        .status(500)
        .send("An error occurred while verifying the user ID.");
    }

    const orders = await OrdersDao.getOrders(decodedUserId);
    res.status(201).json(orders);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({ message: "Failed to create order", error });
  }
});

router.post("/createOrder", async (req, res) => {
  try {
    const { idToken, state: orderData } = req.body;
    let decodedUserId = null;

    if (idToken) {
      decodedUserId = await verifyIdToken(idToken);
      if (!decodedUserId) {
        return res
          .status(500)
          .send("An error occurred while verifying the user ID.");
      }
    }

    const cartItems = await CartItemsDao.getCartItems(decodedUserId);

    const products = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ProductsModel.findById(item.productId);
        if (product) {
          return {
            ...product.toObject(),
            count: item.count,
            totalPrice: (
              (product.price ? product.price : 0) * item.count
            ).toFixed(2),
          };
        }
        return null;
      })
    );

    const validProducts = products.filter((product) => product !== null);

    const totalQuantity = validProducts.reduce(
      (sum, item) => sum + item.count,
      0
    );
    const totalPrice = validProducts
      .reduce((sum, item) => sum + parseFloat(item.totalPrice), 0)
      .toFixed(2);

    const newOrder = await OrdersDao.createOrder({
      userId: decodedUserId,
      products: validProducts,
      total: parseFloat(totalPrice),
      quantity: totalQuantity,
      ...orderData,
    });

    await CartItemsDao.deleteAllCartItems(decodedUserId);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).json({ message: "Failed to create order", error });
  }
});

router.get("/getOrderDetails/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderDetails = await OrdersDao.getOrderById(orderId);
    if (!orderDetails) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(orderDetails);
  } catch (error) {
    console.error((error as Error).message);
    res
      .status(500)
      .json({ message: "Failed to retrieve order details", error });
  }
});

export default router;
