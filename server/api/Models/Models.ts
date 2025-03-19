import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import getCurrentDateWithoutSeconds from "api/utils/getCurrentDateWithoutSeconds";

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
  userId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    min: 1,
  },
});

const CategoriesSchema = new mongoose.Schema({
  _id: ObjectId,
  category: String,
});

const OrderSchema = new mongoose.Schema({
  userId: String,
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 40,
  },
  surname: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 40,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 40,
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
    match: /^\d{2}-\d{3}$/,
  },
  cityTown: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 40,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    length: 9,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 40,
    validate: {
      validator: function (v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Invalid email format",
    },
  },
  products: [
    {
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
      count: Number,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  createDate: {
    type: Date,
    default: getCurrentDateWithoutSeconds,
  },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "CANCELED"],
    default: "PENDING",
  },
});

export const ProductsModel = mongoose.model("products", ProductsSchema);
export const CartItemsModel = mongoose.model("cart_items", CartItemsSchema);
export const CategoriesModel = mongoose.model("categories", CategoriesSchema);
export const OrdersModel = mongoose.model("orders", OrderSchema);
