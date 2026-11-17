<template>
  <v-container fluid class="pa-0 nike-style">
    <!-- LOADING -->
    <div v-if="pending" class="loading-page">
      <v-container>
        <v-skeleton-loader type="heading" class="mb-8" />
        <v-skeleton-loader type="image" height="400" class="mb-8" />
        <v-row>
          <v-col v-for="n in 4" :key="n" cols="6" md="3">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div v-else>
      <!-- TOP ANNOUNCEMENT -->
      <div class="announcement-bar">FREE SHIPPING ON SELECTED ORDERS</div>
      <!-- NAVBAR -->
      <v-app-bar height="76" color="#F4F4F0" elevation="0" class="main-navbar">
        <v-container
          fluid
          class="navbar-container d-flex align-center px-5 px-md-10"
        >
          <!-- LOGO -->
          <NuxtLink to="/" class="brand-logo"> NN. </NuxtLink>

          <v-spacer />

          <!-- DESKTOP NAVIGATION -->
          <div class="desktop-navigation">
            <v-btn href="#top" variant="text" color="black"> Home </v-btn>

            <v-btn href="#products" variant="text" color="black"> Shop </v-btn>

            <v-btn to="/products" variant="text" color="black">
              Collections
            </v-btn>
          </div>

          <v-spacer />

          <!-- DESKTOP CART -->
          <div class="desktop-cart">
            <v-badge
              :content="cartItemCount"
              :model-value="cartItemCount > 0"
              color="error"
              floating
            >
              <v-btn
                icon
                variant="text"
                color="black"
                @click="cartDrawer = true"
              >
                <v-icon size="25">mdi-shopping-bag-outline</v-icon>
              </v-btn>
            </v-badge>
          </div>

          <!-- MOBILE HAMBURGER -->
          <v-btn
            class="mobile-menu-button"
            icon
            variant="text"
            color="black"
            @click="mobileMenu = !mobileMenu"
          >
            <v-icon size="28">
              {{ mobileMenu ? "mdi-close" : "mdi-menu" }}
            </v-icon>
          </v-btn>
        </v-container>
      </v-app-bar>

      <!-- MOBILE MENU DRAWER -->
      <v-navigation-drawer
        v-model="mobileMenu"
        location="right"
        temporary
        width="300"
        class="mobile-navigation"
      >
        <div class="mobile-menu-header">
          <span class="mobile-menu-title">MENU</span>

          <v-btn icon="mdi-close" variant="text" @click="mobileMenu = false" />
        </div>

        <v-divider />

        <div class="mobile-menu-links">
          <a href="#top" @click="mobileMenu = false">
            HOME
            <v-icon>mdi-arrow-up-right</v-icon>
          </a>

          <a href="#products" @click="mobileMenu = false">
            SHOP
            <v-icon>mdi-arrow-up-right</v-icon>
          </a>

          <NuxtLink to="/products" @click="mobileMenu = false">
            COLLECTIONS
            <v-icon>mdi-arrow-up-right</v-icon>
          </NuxtLink>

          <v-divider class="my-3" />

          <button
            class="mobile-cart-link"
            @click="
              mobileMenu = false;
              cartDrawer = true;
            "
          >
            <span>
              <v-icon class="mr-3">mdi-shopping-bag-outline</v-icon>
              MY CART
            </span>

            <v-badge
              :content="cartItemCount"
              :model-value="cartItemCount > 0"
              color="error"
              inline
            />
          </button>
        </div>

        <template #append>
          <div class="mobile-menu-footer">NOOK / NEST — MOVE YOUR WAY.</div>
        </template>
      </v-navigation-drawer>

      <!-- CART DRAWER -->
      <v-navigation-drawer
        v-model="cartDrawer"
        location="right"
        temporary
        width="400"
        class="cart-drawer"
      >
        <div class="d-flex justify-space-between align-center pa-5">
          <h2 class="text-h5 font-weight-bold">YOUR BAG</h2>
          <v-btn icon="mdi-close" variant="text" @click="cartDrawer = false" />
        </div>

        <v-divider />

        <div v-if="cart.length === 0" class="empty-cart">
          <v-icon size="70">mdi-shopping-bag-outline</v-icon>
          <h3 class="mt-4">Your bag is empty.</h3>
          <p class="mt-2">Find something worth wearing.</p>
          <v-btn
            to="/products"
            color="black"
            class="mt-5"
            @click="cartDrawer = false"
          >
            SHOP NOW
          </v-btn>
        </div>

        <div v-else class="pa-4">
          <v-card
            v-for="item in cart"
            :key="item.documentId"
            variant="flat"
            color="#F4F4F0"
            class="mb-3"
          >
            <v-card-text>
              <v-row align="center">
                <v-col cols="4">
                  <v-img
                    :src="getImageUrl(item.image) || undefined"
                    height="90"
                    cover
                  />
                </v-col>

                <v-col cols="8">
                  <div class="d-flex justify-space-between">
                    <strong>{{ item.name }}</strong>
                    <v-btn
                      icon="mdi-delete-outline"
                      size="small"
                      variant="text"
                      @click="removeFromCart(item.documentId)"
                    />
                  </div>

                  <p class="font-weight-bold mt-2">
                    {{ formatPrice(item.price * item.quantity) }}
                  </p>

                  <div class="d-flex align-center mt-2">
                    <v-btn
                      icon="mdi-minus"
                      size="x-small"
                      variant="outlined"
                      :disabled="item.quantity <= 1"
                      @click="decreaseQuantity(item.documentId)"
                    />

                    <span class="mx-3">{{ item.quantity }}</span>

                    <v-btn
                      icon="mdi-plus"
                      size="x-small"
                      variant="outlined"
                      :disabled="item.quantity >= item.stock"
                      @click="increaseQuantity(item.documentId)"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-divider class="my-4" />

          <div class="d-flex justify-space-between mb-4">
            <strong>SUBTOTAL</strong>
            <strong>{{ formatPrice(cartTotal) }}</strong>
          </div>

          <v-btn block variant="outlined" class="mb-3" @click="clearCart">
            CLEAR BAG
          </v-btn>

          <v-btn block color="black" size="large" disabled> CHECKOUT </v-btn>

          <p class="text-caption text-center mt-3">Checkout coming soon.</p>
        </div>
      </v-navigation-drawer>

      <!-- HERO CAROUSEL -->
      <section id="top" class="hero-section">
        <v-carousel
          height="840"
          cycle
          :interval="5000"
          show-arrows="hover"
          hide-delimiter-background
          color="white"
        >
          <!-- SLIDE 1 -->
          <v-carousel-item>
            <div class="hero-slide slide-one">
              <div class="hero-overlay"></div>

              <div class="hero-content">
                <span class="hero-eyebrow"> THE NEW COLLECTION </span>

                <h1>
                  MOVE<br />
                  YOUR<br />
                  WAY.
                </h1>

                <p>
                  Everyday essentials. Timeless style. Discover your next
                  favorite find.
                </p>

                <v-btn
                  href="#products"
                  color="white"
                  rounded="pill"
                  size="x-large"
                  class="hero-button"
                >
                  SHOP NOW
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </div>

              <div class="hero-bottom-label">01 — EVERYDAY COLLECTION</div>
            </div>
          </v-carousel-item>

          <!-- SLIDE 2 -->
          <v-carousel-item>
            <div class="hero-slide slide-two">
              <div class="hero-overlay"></div>

              <div class="hero-content">
                <span class="hero-eyebrow"> FIND YOUR STYLE </span>

                <h1>
                  OWN<br />
                  YOUR<br />
                  LOOK.
                </h1>

                <p>Simple pieces. Strong identity. Make every day your own.</p>

                <v-btn
                  href="#products"
                  color="white"
                  rounded="pill"
                  size="x-large"
                  class="hero-button"
                >
                  EXPLORE NOW
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </div>

              <div class="hero-bottom-label">02 — STYLE COLLECTION</div>
            </div>
          </v-carousel-item>

          <!-- SLIDE 3 -->
          <v-carousel-item>
            <div class="hero-slide slide-three">
              <div class="hero-overlay"></div>

              <div class="hero-content">
                <span class="hero-eyebrow"> MADE FOR EVERYDAY </span>

                <h1>
                  LIVE<br />
                  IN<br />
                  STYLE.
                </h1>

                <p>
                  Discover fresh finds designed to fit your everyday lifestyle.
                </p>

                <v-btn
                  href="#products"
                  color="white"
                  rounded="pill"
                  size="x-large"
                  class="hero-button"
                >
                  DISCOVER MORE
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </div>

              <div class="hero-bottom-label">03 — LIFESTYLE COLLECTION</div>
            </div>
          </v-carousel-item>
        </v-carousel>
      </section>

      <!-- CATEGORIES -->
      <v-container id="categories" class="section-spacing">
        <div class="section-header">
          <div>
            <span class="eyebrow">EXPLORE</span>
            <h2>SHOP BY CATEGORY.</h2>
          </div>
        </div>

        <div class="category-list">
          <v-chip
            :color="selectedCategory === 'All' ? 'black' : undefined"
            :variant="selectedCategory === 'All' ? 'flat' : 'outlined'"
            size="large"
            @click="selectedCategory = 'All'"
          >
            ALL
          </v-chip>

          <v-chip
            v-for="category in categories"
            :key="category"
            :color="selectedCategory === category ? 'black' : undefined"
            :variant="selectedCategory === category ? 'flat' : 'outlined'"
            size="large"
            @click="selectedCategory = category"
          >
            {{ category.toUpperCase() }}
          </v-chip>
        </div>
      </v-container>

      <!-- PROMOTION -->
      <v-container class="section-spacing">
        <section class="promo-section">
          <div>
            <span class="eyebrow light-eyebrow"> MADE FOR EVERYDAY </span>

            <h2>
              LESS ORDINARY.<br />
              MORE YOU.
            </h2>

            <p>
              Discover products that bring style and simplicity into your
              everyday life.
            </p>

            <v-btn to="/products" color="white" rounded="pill" size="large">
              EXPLORE MORE
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </div>

          <v-icon size="150" color="#D5D5D0">
            mdi-star-four-points-outline
          </v-icon>
        </section>
      </v-container>

      <!-- FEATURED PRODUCTS -->
      <v-container id="products" class="section-spacing pb-12">
        <!-- PRODUCT HEADER -->
        <div class="section-header">
          <div>
            <span class="eyebrow">THE COLLECTION</span>
            <h2>FRESH FINDS.</h2>
            <p>Find your next everyday favorite.</p>
          </div>

          <v-btn
            to="/products"
            variant="text"
            color="black"
            class="font-weight-bold"
          >
            VIEW ALL
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </div>

        <!-- PRODUCT SEARCH -->
        <div class="product-search-area">
          <div class="product-search">
            <v-icon icon="mdi-magnify" size="23" color="#777" />

            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products, categories..."
              class="product-search-input"
            />

            <button
              v-if="searchQuery"
              class="search-clear"
              @click="searchQuery = ''"
              aria-label="Clear search"
            >
              <v-icon icon="mdi-close" />
            </button>
          </div>

          <span class="search-caption"> FIND SOMETHING YOU LOVE. </span>
        </div>

        <!-- CATEGORY FILTER -->
        <div class="category-list product-category-list">
          <v-chip
            :color="selectedCategory === 'All' ? 'black' : undefined"
            :variant="selectedCategory === 'All' ? 'flat' : 'outlined'"
            size="large"
            @click="selectedCategory = 'All'"
          >
            ALL
          </v-chip>

          <v-chip
            v-for="category in categories"
            :key="category"
            :color="selectedCategory === category ? 'black' : undefined"
            :variant="selectedCategory === category ? 'flat' : 'outlined'"
            size="large"
            @click="selectedCategory = category"
          >
            {{ category.toUpperCase() }}
          </v-chip>
        </div>

        <!-- ERROR -->
        <v-alert v-if="error" type="warning" variant="tonal" class="mt-6">
          Unable to load products. Please check your Strapi connection.
        </v-alert>

        <!-- EMPTY -->
        <v-alert
          v-else-if="filteredProducts.length === 0"
          type="info"
          variant="tonal"
          class="mt-6"
        >
          No products found. Try another search.
        </v-alert>

        <!-- PRODUCT GRID -->
        <v-row v-else class="mt-4">
          <v-col
            v-for="product in filteredProducts"
            :key="product.documentId"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              class="product-card"
              rounded="0"
              elevation="0"
              height="100%"
            >
              <div class="product-image">
                <v-img
                  v-if="getImageUrl(product.image)"
                  :src="getImageUrl(product.image)"
                  height="270"
                  cover
                />

                <div v-else class="image-placeholder">
                  <v-icon size="60">mdi-image-outline</v-icon>
                </div>

                <v-btn
                  icon
                  size="small"
                  color="white"
                  class="wishlist-button"
                  @click.stop="toggleWishlist(product)"
                >
                  <v-icon :color="isWishlisted(product) ? 'red' : 'black'">
                    {{
                      isWishlisted(product) ? "mdi-heart" : "mdi-heart-outline"
                    }}
                  </v-icon>
                </v-btn>

                <div class="product-tag" v-if="product.stock > 0">
                  AVAILABLE
                </div>

                <div class="product-tag out-of-stock" v-else>SOLD OUT</div>
              </div>

              <v-card-text class="px-0">
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <h3 class="product-name">
                      {{ product.name }}
                    </h3>

                    <p class="product-category">
                      {{ product.category || "EVERYDAY COLLECTION" }}
                    </p>
                  </div>

                  <strong class="product-price">
                    {{ formatPrice(product.price) }}
                  </strong>
                </div>

                <p class="product-description">
                  {{
                    product.description || "A fresh find for everyday living."
                  }}
                </p>
              </v-card-text>

              <v-card-actions class="pa-0 pb-4">
                <v-btn
                  color="black"
                  block
                  rounded="pill"
                  :disabled="product.stock <= 0"
                  @click="addToCart(product)"
                >
                  ADD TO BAG
                  <v-icon end>mdi-plus</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- NEWSLETTER -->
      <section class="newsletter-section">
        <v-container class="py-12">
          <v-row align="center">
            <v-col cols="12" md="6">
              <span class="eyebrow">STAY IN THE GAME</span>

              <h2>
                NEVER MISS<br />
                A THING.
              </h2>

              <p>Get the latest updates, new arrivals, and exclusive offers.</p>
            </v-col>

            <v-col cols="12" md="6">
              <v-form @submit.prevent="subscribeNewsletter">
                <v-text-field
                  v-model="newsletterEmail"
                  label="Your email address"
                  type="email"
                  variant="outlined"
                  bg-color="white"
                  rounded="lg"
                  prepend-inner-icon="mdi-email-outline"
                  :rules="emailRules"
                  required
                />

                <v-btn
                  type="submit"
                  color="black"
                  block
                  size="large"
                  rounded="pill"
                >
                  JOIN THE COMMUNITY
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- FOOTER -->
      <v-footer class="main-footer">
        <v-container class="py-10">
          <v-row>
            <v-col cols="12" md="6">
              <div class="footer-logo">NN.</div>

              <p class="footer-description">
                Everyday essentials.<br />
                Timeless style. Your way.
              </p>
            </v-col>

            <v-col cols="6" md="3">
              <h4>EXPLORE</h4>

              <div class="footer-links">
                <NuxtLink to="/">Home</NuxtLink>
                <NuxtLink to="/products">Shop</NuxtLink>
              </div>
            </v-col>

            <v-col cols="6" md="3">
              <h4>ABOUT</h4>

              <div class="footer-links">
                <a href="#top">Our Collection</a>
                <a href="#top">Back to Top</a>
              </div>
            </v-col>
          </v-row>

          <v-divider color="#555" class="my-6" />

          <div class="footer-bottom">
            © {{ new Date().getFullYear() }} NOOK / NEST. ALL RIGHTS RESERVED.
          </div>
        </v-container>
      </v-footer>

      <!-- SNACKBAR -->
      <v-snackbar
        v-model="showCartMessage"
        color="black"
        timeout="2500"
        rounded="lg"
      >
        {{ cartMessage }}
      </v-snackbar>
    </div>
  </v-container>
</template>

<script setup lang="ts">
// SEO
useHead({
  title: "NOOK / NEST | Move Your Way",
  meta: [
    {
      name: "description",
      content:
        "Discover everyday essentials and timeless finds at NOOK / NEST.",
    },
    {
      name: "theme-color",
      content: "#F4F4F0",
    },
  ],
});

// STRAPI
const config = useRuntimeConfig();
const STRAPI_URL = config.public.strapiUrl;

// PRODUCT INTERFACE
interface Product {
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

// CART INTERFACE
interface CartItem extends Product {
  quantity: number;
}

// SEARCH
const searchQuery = ref("");
const selectedCategory = ref("All");

// CART
const cartDrawer = ref(false);
const cart = ref<CartItem[]>([]);

// MOBILE NAVIGATION
const mobileMenu = ref(false);

// NOTIFICATION
const showCartMessage = ref(false);
const cartMessage = ref("");

// FETCH PRODUCTS
const {
  data: response,
  pending,
  error,
} = await useFetch<{ data: Product[] }>(`${STRAPI_URL}/api/products`, {
  lazy: true,
  query: {
    populate: "image",
    sort: "createdAt:desc",
    "pagination[pageSize]": 100,
    "filters[is_active][$eq]": true,
  },
});

// PRODUCTS
const products = computed(() => {
  return response.value?.data ?? [];
});

// CATEGORIES
const categories = computed(() => {
  return [
    ...new Set(
      products.value.map((product) => product.category).filter(Boolean),
    ),
  ];
});

// FILTER PRODUCTS
const filteredProducts = computed(() => {
  return products.value
    .filter((product) => product.is_active)
    .filter((product) => {
      const search = searchQuery.value.toLowerCase().trim();

      const matchesSearch =
        product.name?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory.value === "All" ||
        product.category === selectedCategory.value;

      return matchesSearch && matchesCategory;
    })
    .slice(0, 8);
});

// CART COUNT
const cartItemCount = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0);
});

// CART TOTAL
const cartTotal = computed(() => {
  return cart.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
});

// ADD TO CART
function addToCart(product: Product) {
  const existingItem = cart.value.find(
    (item) => item.documentId === product.documentId,
  );

  if (!product.is_active) {
    cartMessage.value = "This product is unavailable.";
    showCartMessage.value = true;
    return;
  }

  if (product.stock <= 0) {
    cartMessage.value = "This product is out of stock.";
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

  cartMessage.value = `${product.name} added to your bag!`;
  showCartMessage.value = true;
}

// INCREASE
function increaseQuantity(documentId: string) {
  const item = cart.value.find((item) => item.documentId === documentId);

  if (!item) return;

  if (item.quantity < item.stock) {
    item.quantity++;
  }
}

// DECREASE
function decreaseQuantity(documentId: string) {
  const item = cart.value.find((item) => item.documentId === documentId);

  if (!item) return;

  if (item.quantity > 1) {
    item.quantity--;
  }
}

// REMOVE
function removeFromCart(documentId: string) {
  cart.value = cart.value.filter((item) => item.documentId !== documentId);
}

// CLEAR
function clearCart() {
  cart.value = [];
}

// IMAGE URL
function getImageUrl(image: any): string {
  const imageData = Array.isArray(image) ? image[0] : image;

  if (!imageData?.url) return "";

  const imageUrl =
    imageData.formats?.medium?.url ||
    imageData.formats?.small?.url ||
    imageData.url;

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${STRAPI_URL}${imageUrl}`;
}

// FORMAT PRICE
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price || 0);
}

// WISHLIST
const wishlist = ref<string[]>([]);

function toggleWishlist(product: Product) {
  const productId = product.documentId;

  if (wishlist.value.includes(productId)) {
    wishlist.value = wishlist.value.filter((id) => id !== productId);

    cartMessage.value = `${product.name} removed from wishlist.`;
  } else {
    wishlist.value.push(productId);

    cartMessage.value = `${product.name} added to wishlist!`;
  }

  showCartMessage.value = true;
}

function isWishlisted(product: Product): boolean {
  return wishlist.value.includes(product.documentId);
}

// NEWSLETTER
const newsletterEmail = ref("");

const emailRules = [
  (value: string) => !!value || "Email is required.",
  (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
    "Please enter a valid email address.",
];

function subscribeNewsletter() {
  if (
    !newsletterEmail.value ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.value)
  ) {
    cartMessage.value = "Please enter a valid email address.";
    showCartMessage.value = true;
    return;
  }

  cartMessage.value = "Welcome to the NOOK / NEST community!";
  showCartMessage.value = true;

  newsletterEmail.value = "";
}
</script>

<style scoped>
/* BASE */
.nike-style {
  background: #f4f4f0;
  color: #111111;
  min-height: 100vh;
}

.loading-page {
  min-height: 100vh;
  padding: 40px;
}

/* ANNOUNCEMENT */
.announcement-bar {
  background: #111111;
  color: white;
  text-align: center;
  padding: 9px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

/* NAVIGATION */
.main-navbar {
  border-bottom: 1px solid #e6e6e0;
  position: sticky !important;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1500px;
  margin: 0 auto;
}

.brand-logo {
  color: #111;
  text-decoration: none;
  font-size: 37px;
  font-weight: 1000;
  letter-spacing: -4px;
  line-height: 1;
}

.desktop-navigation {
  display: flex;
  align-items: center;
  gap: 12px;
}

.desktop-navigation :deep(.v-btn) {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.desktop-cart {
  display: flex;
  align-items: center;
}

.mobile-menu-button {
  display: none;
}

/* MOBILE DRAWER */
.mobile-navigation {
  background: #f4f4f0;
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.mobile-menu-title {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 2px;
}

.mobile-menu-links {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.mobile-menu-links a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  color: #111;
  text-decoration: none;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: 1px;
  border-bottom: 1px solid #deded8;
}

.mobile-menu-links a:hover {
  opacity: 0.6;
}

.mobile-cart-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 0;
  color: #111;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: 1px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.mobile-menu-footer {
  padding: 20px;
  color: #888;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
  border-top: 1px solid #deded8;
}

.brand-logo {
  color: #111111;
  text-decoration: none;
  font-size: 37px;
  font-weight: 1000;
  letter-spacing: -4px;
  line-height: 1;
}

.desktop-navigation {
  display: flex;
  align-items: center;
}

.search-panel {
  max-width: 800px;
}

/* SMOOTH SCROLL */
:global(html) {
  scroll-behavior: smooth;
}

#products,
#categories,
#top {
  scroll-margin-top: 85px;
}

/* HERO CAROUSEL */
.hero-section {
  width: 100%;
  overflow: hidden;
}

.hero-slide {
  position: relative;
  min-height: 540px;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 60px 9%;
  background-size: cover;
  background-position: center;
}

/* SLIDE BACKGROUNDS */
.slide-one {
  background-image: url("https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1800&q=85");
  background-position: center 35%;
}

.slide-two {
  background-image: url("https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1800&q=85");
  background-position: center;
}

.slide-three {
  background-image: url("https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=85");
  background-position: center;
}

/* OVERLAY */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.78),
    rgba(0, 0, 0, 0.32),
    rgba(0, 0, 0, 0.05)
  );
}

/* HERO CONTENT */
.hero-content {
  position: relative;
  z-index: 2;
  color: white;
  max-width: 650px;
}

.hero-content h1 {
  font-size: clamp(75px, 12vw, 145px);
  font-weight: 1000;
  line-height: 0.82;
  letter-spacing: -8px;
  margin-top: 24px;
}

.hero-content p {
  max-width: 420px;
  font-size: 16px;
  line-height: 1.7;
  margin-top: 28px;
  margin-bottom: 28px;
}

.hero-bottom-label {
  position: absolute;
  right: 30px;
  bottom: 22px;
  z-index: 2;
  color: white;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
}

.hero-button {
  color: #111 !important;
  font-weight: 800;
}

/* PRODUCT SEARCH */
.product-search-area {
  margin-top: 28px;
  max-width: 650px;
}

.product-search {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  background: #e9e9e4;
  border: 1px solid transparent;
  padding: 0 18px;
  min-height: 58px;
  transition: all 0.25s ease;
}

.product-search:focus-within {
  background: #fff;
  border-color: #111;
}

.product-search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #111;
  font-size: 14px;
  font-family: inherit;
  height: 56px;
}

.product-search-input::placeholder {
  color: #888;
}

.search-clear {
  border: none;
  background: transparent;
  cursor: pointer;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-caption {
  display: block;
  margin-top: 9px;
  color: #888;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.product-category-list {
  margin-top: 22px;
}

@media (max-width: 600px) {
  .desktop-navigation,
  .desktop-cart {
    display: none !important;
  }

  .mobile-menu-button {
    display: inline-flex !important;
  }

  .brand-logo {
    font-size: 34px;
  }
}
.hero-content {
  color: white;
  position: relative;
  z-index: 2;
  max-width: 650px;
}

.hero-eyebrow,
.eyebrow {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 2px;
}

.hero-content h1 {
  font-size: clamp(75px, 12vw, 145px);
  font-weight: 1000;
  line-height: 0.82;
  letter-spacing: -8px;
  margin-top: 24px;
}

.hero-content p {
  max-width: 420px;
  font-size: 16px;
  line-height: 1.7;
  margin-top: 28px;
  margin-bottom: 28px;
}

.hero-button {
  color: #111111 !important;
  font-weight: 800;
}

.hero-bottom-label {
  position: absolute;
  right: 30px;
  bottom: 22px;
  color: white;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
}

/* SECTIONS */
.section-spacing {
  padding-top: 55px;
}

.section-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 15px;
}

.section-header h2 {
  font-size: clamp(25px, 4vw, 36px);
  font-weight: 1000;
  letter-spacing: -1.5px;
  margin-top: 8px;
}

.section-header p {
  color: #777777;
  margin-top: 5px;
  font-size: 14px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

/* PROMOTION */
.promo-section {
  background: #191919;
  color: white;
  padding: 55px;
  min-height: 280px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.light-eyebrow {
  color: #bdbdbd;
}

.promo-section h2 {
  font-size: clamp(32px, 5vw, 55px);
  line-height: 1;
  font-weight: 1000;
  letter-spacing: -2px;
  margin-top: 18px;
}

.promo-section p {
  color: #cccccc;
  margin-top: 15px;
  margin-bottom: 25px;
  max-width: 430px;
  line-height: 1.7;
}

/* PRODUCT CARDS */
.product-card {
  background: transparent;
}

.product-image {
  position: relative;
  background: #e7e7e2;
  overflow: hidden;
}

.product-image :deep(.v-img img) {
  transition: transform 0.4s ease;
}

.product-card:hover .product-image :deep(.v-img img) {
  transform: scale(1.05);
}

.image-placeholder {
  height: 270px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wishlist-button {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
}

.product-tag {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: white;
  color: #111111;
  padding: 7px 11px;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1px;
}

.out-of-stock {
  background: #111111;
  color: white;
}

.product-name {
  font-size: 15px;
  font-weight: 800;
}

.product-category {
  color: #777777;
  font-size: 11px;
  margin-top: 5px;
}

.product-price {
  font-size: 14px;
  font-weight: 900;
  white-space: nowrap;
}

.product-description {
  color: #777777;
  font-size: 12px;
  line-height: 1.6;
  margin-top: 12px;
  min-height: 38px;
}

/* NEWSLETTER */
.newsletter-section {
  background: #e4e4df;
}

.newsletter-section h2 {
  font-size: clamp(38px, 6vw, 65px);
  line-height: 0.95;
  font-weight: 1000;
  letter-spacing: -3px;
  margin-top: 18px;
}

.newsletter-section p {
  color: #555555;
  margin-top: 18px;
  max-width: 400px;
  line-height: 1.7;
}

/* FOOTER */
.main-footer {
  background: #111111;
  color: white;
}

.footer-logo {
  font-size: 65px;
  font-weight: 1000;
  letter-spacing: -7px;
}

.footer-description {
  color: #aaaaaa;
  line-height: 1.8;
  font-size: 13px;
}

.main-footer h4 {
  font-size: 12px;
  letter-spacing: 1px;
  margin-bottom: 18px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.footer-links a {
  text-decoration: none;
  color: #aaaaaa;
  font-size: 13px;
}

.footer-links a:hover {
  color: white;
}

.footer-bottom {
  color: #888888;
  font-size: 10px;
  letter-spacing: 1px;
}

/* CART */
.cart-drawer {
  max-width: 100vw;
}

.empty-cart {
  text-align: center;
  padding: 55px 25px;
  color: #777777;
}

/* MOBILE */
@media (max-width: 600px) {
  .desktop-navigation {
    display: none;
  }

  .hero-image {
    min-height: 490px;
    padding: 45px 25px;
    background-position: 60% center;
  }

  .hero-content h1 {
    font-size: 78px;
    letter-spacing: -5px;
  }

  .hero-content p {
    font-size: 14px;
  }

  .hero-bottom-label {
    font-size: 8px;
    right: 15px;
  }

  .promo-section {
    padding: 30px 23px;
  }

  .promo-section > :deep(.v-icon) {
    display: none;
  }

  .section-spacing {
    padding-top: 38px;
  }

  .newsletter-section h2 {
    font-size: 45px;
  }
}
</style>
