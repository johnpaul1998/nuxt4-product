export interface Product {
  id: number;
  documentId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  is_active: boolean;
  image: any;
}

export const useProducts = () => {
  const config = useRuntimeConfig();
  const STRAPI_URL = config.public.strapiUrl;
  const products = useState<Product[]>("products", () => []);

  // FETCH PRODUCTS
  const {
    data: response,
    pending,
    error,
  } = useFetch<{ data: Product[] }>(`${STRAPI_URL}/api/products`, {
    lazy: true,
    query: {
      populate: "image",
      sort: "createdAt:desc",
      "pagination[pageSize]": 100,
      "filters[is_active][$eq]": true,
    },
  });

  watch(
    response,
    (newResponse) => {
      if (newResponse?.data) {
        products.value = newResponse.data;
      }
    },
    { immediate: true },
  );

  // UPDATE PRODUCT STATE AFTER CHECKOUT
  function updateProductState(updatedProduct: Product) {
    const index = products.value.findIndex(
      (product) => product.documentId === updatedProduct.documentId,
    );

    if (index === -1) return;

    const existingProduct = products.value[index];
    if (!existingProduct) return;

    products.value[index] = {
      ...existingProduct,
      ...updatedProduct,
      image: updatedProduct.image || existingProduct.image,
    };
  }

  return {
    STRAPI_URL,
    products,
    data: response,
    pending,
    error,
    updateProductState,
  };
};
