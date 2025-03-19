import { verifyIdToken } from "../utils/Auth";
import {
  getCartItems,
  deleteAllCartItems,
} from "../repositories/cartRepository";
import { getProductByIdFromDB } from "../repositories/productRepository";
import {
  getOrdersByUserId,
  createNewOrder,
  getOrderById,
} from "../repositories/orderRepository";
import { ObjectId } from "mongodb";
import { Order, OrderData, OrderProduct } from "api/types/orderTypes";
import { AggregatedCartItem } from "api/types/cartTypes";
import { Product } from "api/types/productTypes";

export const fetchOrders = async (idToken: string): Promise<Order[]> => {
  const decodedUserId = await verifyIdToken(idToken);
  return getOrdersByUserId(decodedUserId);
};

export const processOrderCreation = async (
  idToken: string | undefined,
  orderData: OrderData
): Promise<Order | { error: string }> => {
  try {
    const decodedUserId = idToken ? await verifyIdToken(idToken) : null;

    let products: (OrderProduct | null)[] = [];

    if (decodedUserId) {
      const cartItems = (await getCartItems(
        decodedUserId
      )) as AggregatedCartItem[];

      products = cartItems.map((item) => {
        if (!item.productDetails || item.productDetails.length === 0) {
          console.error(
            `No product details for cart item with productId: ${item.productId}`
          );
          return null;
        }
        const product = item.productDetails[0] as Product;
        const numericId = (product as any).id ?? 0;
        return {
          _id: product._id.toString(),
          productId: product._id.toString(),
          id: numericId,
          count: item.count ?? 1,
          totalPrice: (product.price || 0) * (item.count ?? 1),
          title: product.title,
          description: product.description,
          price: product.price,
          discountPercentage: product.discountPercentage,
          rating: product.rating,
          stock: product.stock,
          brand: product.brand,
          category: product.category,
          thumbnail: product.thumbnail,
          images: product.images,
        };
      });
    } else {
      if (!orderData.products || orderData.products.length === 0) {
        return { error: "No products found for this order" };
      }
      products = await Promise.all(
        orderData.products.map(async (prod) => {
          if (!prod.productId) {
            console.error("Product ID is missing in orderData.products");
            return null;
          }
          const productDetails = await getProductByIdFromDB(prod.productId);
          if (!productDetails) {
            console.error(
              `No product details found for productId: ${prod.productId}`
            );
            return null;
          }
          const numericId = (productDetails as any).id ?? 0;
          return {
            _id: productDetails._id.toString(),
            productId: productDetails._id.toString(),
            id: numericId,
            count: prod.count ?? 1,
            totalPrice: (productDetails.price || 0) * (prod.count ?? 1),
            title: productDetails.title,
            description: productDetails.description,
            price: productDetails.price,
            discountPercentage: productDetails.discountPercentage,
            rating: productDetails.rating,
            stock: productDetails.stock,
            brand: productDetails.brand,
            category: productDetails.category,
            thumbnail: productDetails.thumbnail,
            images: productDetails.images,
          };
        })
      );
    }

    products = products.filter((p): p is OrderProduct => p !== null);

    if (products.length === 0) {
      return { error: "No products found for this order" };
    }

    const totalQuantity = products.reduce(
      (sum, item) => sum + (item?.count ?? 0),
      0
    );
    const totalPrice = products.reduce(
      (sum, item) => sum + (item?.totalPrice ?? 0),
      0
    );

    const newOrder = await createNewOrder({
      userId: decodedUserId ?? undefined,
      products,
      total: totalPrice,
      quantity: totalQuantity,
      name: orderData.name,
      surname: orderData.surname,
      address: orderData.address,
      zipCode: orderData.zipCode,
      cityTown: orderData.cityTown,
      phone: orderData.phone,
      email: orderData.email,
    });

    if (decodedUserId) {
      await deleteAllCartItems(decodedUserId);
    }

    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    return { error: "Failed to create order" };
  }
};

export const fetchOrderDetails = async (orderId: string) => {
  return getOrderById(orderId);
};
