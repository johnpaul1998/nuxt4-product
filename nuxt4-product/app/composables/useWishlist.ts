import type { Product } from "~/composables/useProducts";

// WISHLIST
export const useWishlist = () => {
  const wishlist = ref<string[]>([]);
  function toggleWishlist(product: Product) {
    const productId = product.documentId;

    if (wishlist.value.includes(productId)) {
      wishlist.value = wishlist.value.filter((id) => id !== productId);
      return `${product.name} removed from wishlist.`;
    }
    wishlist.value.push(productId);
    return `${product.name} added to wishlist!`;
  }

  function isWishlisted(product: Product): boolean {
    return wishlist.value.includes(product.documentId);
  }
  return {
    wishlist,
    toggleWishlist,
    isWishlisted,
  };
};
