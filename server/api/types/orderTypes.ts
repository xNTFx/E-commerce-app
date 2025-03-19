import { Product } from "./productTypes";

export interface OrderProduct {
  productId: string;
  count: number;
  totalPrice: number;
}

export interface Order {
  _id: string;
  userId?: string;
  products: OrderProduct[];
  total: number;
  quantity: number;
  name: string;
  surname: string;
  address: string;
  zipCode: string;
  cityTown: string;
  phone: string;
  email: string;
  status: "PENDING" | "COMPLETED" | "CANCELED";
}

export interface OrderData {
  name: string;
  surname: string;
  address: string;
  zipCode: string;
  cityTown: string;
  phone: string;
  email: string;
  products?: (Product & { count?: number; productId?: string })[];
}

export interface OrderProduct {
  _id: string;
  productId: string;
  id: number;
  count: number;
  totalPrice: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images: string[];
}
