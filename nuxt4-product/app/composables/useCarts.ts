import type { Product } from "~/composables/useProducts";
export interface CartItem extends Product {
  quantity: number;
}

export const useCarts = () => {
  // CART
  const cart = ref<CartItem[]>([]);
  const isCartLoaded = ref(false);
  const CART_STORAGE_KEY = "mike-shopping-cart";

  // NOTIFICATION
  const showCartMessage = ref(false);
  const cartMessage = ref("");
  // CART COUNT
  const cartItemCount = computed(() =>
    cart.value.reduce((total, item) => total + item.quantity, 0),
  );

  // CART TOTAL
  const cartTotal = computed(() =>
    cart.value.reduce((total, item) => total + item.price * item.quantity, 0),
  );

  // ADD TO CART
  function addToCart(product: Product) {
    const existingItem = cart.value.find(
      (item) => item.documentId === product.documentId,
    );

    if (!product.is_active || product.stock <= 0) {
      cartMessage.value = "This product is unavailable.";
      showCartMessage.value = true;
      return;
    }

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        cartMessage.value = "Maximum available stock reached.";
        showCartMessage.value = true;
        return;
      }

      existingItem.quantity++;
    } else {
      cart.value.push({
        ...product,
        quantity: 1,
      });
    }

    cartMessage.value = `${product.name} added to your cart!`;
    showCartMessage.value = true;
  }

  // QUANTITY
  function increaseQuantity(documentId: string) {
    const item = cart.value.find((item) => item.documentId === documentId);

    if(!item?.stock) return;
    if (item.quantity < item.stock) {
      item.quantity++;
    }
  }

  function decreaseQuantity(documentId: string) {
    const item = cart.value.find((item) => item.documentId === documentId);

    if (item && item.quantity > 1) {
      item.quantity--;
    }
  }

  // REMOVE FROM CART
  function removeFromCart(documentId: string) {
    cart.value = cart.value.filter((item) => item.documentId !== documentId);
  }

  onMounted(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          cart.value = parsedCart;
        }
      }
    } catch (error) {
      console.error("Unable to restore cart:", error);
    }

    isCartLoaded.value = true;
  });

  watch(
    cart,
    (newCart) => {
      try {
        if (!isCartLoaded.value) return;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      } catch (error) {
        console.error("Unable to set cart:", error);
      }
    },
    { deep: true },
  );
  return {
    cart,
    cartItemCount,
    cartMessage,
    cartTotal,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    showCartMessage,
    isCartLoaded,
  };
};
