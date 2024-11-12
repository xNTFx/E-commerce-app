import { CartItemsModel } from "api/DTO/DTO";
import { ObjectId } from "mongodb";

export class CartItemsDao {
  static async getCartItems(userId: string) {
    try {
      return await CartItemsModel.aggregate([
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
    } catch (error) {
      console.error("Błąd podczas pobierania elementów koszyka:", error);
      throw error;
    }
  }

  static async updateOrAddCartItem(
    userId: string,
    productId: string,
    count: number
  ) {
    try {
      const existingCartItem = await CartItemsModel.findOne({
        userId,
        productId,
      });

      if (existingCartItem) {
        existingCartItem.count
          ? (existingCartItem.count += count)
          : (existingCartItem.count = 1);
        await existingCartItem.save();
        return existingCartItem;
      } else {
        return await CartItemsModel.create({
          _id: new ObjectId(),
          userId,
          productId,
          count,
        });
      }
    } catch (error) {
      console.error("Error adding/updating cart item:", error);
      throw error;
    }
  }

  static async deleteCartItem(userId: string, cartId: string) {
    try {
      return await CartItemsModel.deleteOne({ userId, _id: cartId });
    } catch (error) {
      console.error("Error deleting cart item:", error);
      throw error;
    }
  }

  static async deleteAllCartItems(userId: string) {
    try {
      return await CartItemsModel.deleteMany({ userId });
    } catch (error) {
      console.error("Error deleting all cart items:", error);
      throw error;
    }
  }
}
