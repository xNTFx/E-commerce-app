import { CartItemsModel } from "api/Models/Models";
import { CartItem } from "api/types/cartTypes";
import { ObjectId } from "mongodb";

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  return CartItemsModel.aggregate([
    { $match: { userId } },
    {
      $lookup: {
        from: "products",
        let: { productId: { $toObjectId: "$productId" } },
        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$productId"] } } }],
        as: "productDetails",
      },
    },
  ]);
};

export const addOrUpdateCartItem = async (
  userId: string,
  productId: string,
  count: number
) => {
  let cartItem = await CartItemsModel.findOne({ userId, productId });

  if (cartItem) {
    cartItem.count += count;
  } else {
    cartItem = new CartItemsModel({ userId, productId, count });
  }

  return cartItem.save();
};

export const updateCartItem = async (
  userId: string,
  productId: string,
  count: number
) => {
  return CartItemsModel.findOneAndUpdate(
    { userId, productId },
    { count },
    { new: true, upsert: true }
  );
};

export const deleteCartItem = async (userId: string, cartId: string) => {
  return CartItemsModel.deleteOne({ _id: new ObjectId(cartId), userId });
};

export const deleteAllCartItems = async (userId: string) => {
  return CartItemsModel.deleteMany({ userId });
};
