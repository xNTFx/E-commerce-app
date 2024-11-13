import { CartItemsType, ProductType, UpdateCartType } from '../types/APITypes';

async function updateCartLocalStorage(newCart: UpdateCartType) {
  const cart = localStorage.getItem('cartItems');
  if (!cart) return;
  const parseCart = JSON.parse(cart);

  const updatedCart = parseCart.map((cartItem: CartItemsType) =>
    cartItem.productId === newCart.productId
      ? { ...cartItem, count: newCart.count }
      : cartItem,
  );

  localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  return updatedCart;
}

async function addProductToLocalStorage(newProduct: CartItemsType) {
  try {
    const existingProductsString = localStorage.getItem('cartItems');
    let existingProducts: CartItemsType[] = [];

    const countToAdd = newProduct.count ?? 0;

    if (existingProductsString) {
      existingProducts = JSON.parse(existingProductsString);

      const foundIndex = existingProducts.findIndex(
        (item) => item.productId === newProduct.productId,
      );

      if (foundIndex !== -1 && existingProducts[foundIndex]) {
        existingProducts[foundIndex].count =
          (existingProducts[foundIndex].count ?? 0) + countToAdd;
      } else {
        existingProducts.unshift({
          productId: newProduct.productId,
          count: countToAdd,
        });
      }
    } else {
      existingProducts.unshift({
        productId: newProduct.productId,
        count: countToAdd,
      });
    }

    const updatedProductsString = JSON.stringify(existingProducts);
    localStorage.setItem('cartItems', updatedProductsString);

    return existingProducts;
  } catch (error) {
    console.error('Failed to add product to localStorage:', error);
    return null;
  }
}

async function deleteCartItemFromLocalstorage() {
  const existingCart = localStorage.getItem('cartItems');
  if (!existingCart) return;
  localStorage.setItem('cartItems', '');
}

async function deleteCartItemFromLocalStorage({ productId }: CartItemsType) {
  const existingProductsString = localStorage.getItem('cartItems');
  if (!existingProductsString) return;

  const parseLocalStorage = JSON.parse(existingProductsString);
  const filteredLocalStorage = parseLocalStorage.filter(
    (element: ProductType) => element.productId !== productId,
  );

  if (filteredLocalStorage.length > 0) {
    localStorage.setItem('cartItems', JSON.stringify(filteredLocalStorage));
  } else {
    localStorage.removeItem('cartItems');
  }
}

const addProductsFromFromLocalStorageToAccountCart = async (
  addProductsMutate: (data: string[]) => void,
) => {
  const localStorageData = localStorage.getItem('cartItems');
  if (!localStorageData) return;
  const parseLocalStorageData = JSON.parse(localStorageData);

  addProductsMutate(parseLocalStorageData);

  localStorage.removeItem('cartItems');
};

export {
  updateCartLocalStorage,
  addProductToLocalStorage,
  deleteCartItemFromLocalstorage,
  deleteCartItemFromLocalStorage,
  addProductsFromFromLocalStorageToAccountCart,
};
