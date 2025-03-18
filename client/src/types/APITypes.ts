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
  count?: number;
}

interface CartItemsType {
  _id?: string;
  userId?: string | null;
  productId: string;
  count?: number;
  productDetails?: ProductType[];
}

type Person = {
  name: string;
  surname: string;
  address: string;
  zipCode: string;
  cityTown: string;
  phone: string;
  email: string;
};

interface CreateOrderType {
  state: Person & { products: ProductType[] };
}

interface UpdateCartType {
  userId?: string;
  cartId?: string;
  productId?: string;
  count: number;
}

interface DeleteCartItemType {
  userId?: string | undefined;
  cartId?: string;
  productId?: string;
}

interface CategoriesProps {
  _id: string;
  category: string;
}

interface OrderProps {
  _id: string;
  userId?: string;
  name: string;
  surname: string;
  address: string;
  zipCode: string;
  cityTown: string;
  phone: string;
  email: string;
  status: string;
  createDate: string;
  products: ProductType[];
  quantity: number;
  total: number;
}

export type {
  ProductType,
  CreateOrderType,
  CartItemsType,
  UpdateCartType,
  DeleteCartItemType,
  CategoriesProps,
  OrderProps,
  Person,
};
