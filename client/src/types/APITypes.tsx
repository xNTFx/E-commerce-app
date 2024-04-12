interface ProductType {
  _id: string;
  id: string;
  productId?: string;
  brand: string;
  category: string;
  description: string;
  discountPercentage: number;
  images: string[];
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  title: string;
}

interface CartItemsType {
  _id?: string;
  userId?: string | null;
  productId: string;
  count: number;
  productDetails?: ProductType[];
}

interface UpdateCartType {
  userId?: string;
  cartId?: string;
  productId?: string;
  newCount: number;
}

export type { ProductType, CartItemsType, UpdateCartType };
