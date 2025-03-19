import { Product } from "./productTypes";

export interface CartItem {
  userId: string;
  productId: string;
  count: number;
}

export interface AggregatedCartItem extends CartItem {
  productDetails: Product[];
}
