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
      <!-- ANNOUNCEMENT -->
      <div class="announcement-bar">FREE SHIPPING ON SELECTED ORDERS</div>

      <!-- NAVBAR -->
      <v-app-bar height="76" color="#F4F4F0" elevation="0" class="main-navbar">
        <v-container
          fluid
          class="navbar-container d-flex align-center px-5 px-md-10"
        >
          <NuxtLink to="/" class="brand-logo">JP.</NuxtLink>

          <v-spacer />

          <div class="desktop-navigation">
            <v-btn href="#top" variant="text" color="black">HOME</v-btn>
            <v-btn href="#products" variant="text" color="black">SHOP</v-btn>
            <v-btn to="/products" variant="text" color="black"
              >COLLECTIONS</v-btn
            >
          </div>

          <v-spacer />

          <div class="desktop-cart">
            <v-badge
              :content="cartItemCount"
              :model-value="cartItemCount > 0"
              color="red"
            >
              <v-btn icon variant="text" @click="cartDrawer = true">
                <v-icon size="27">mdi-cart-outline</v-icon>
              </v-btn>
            </v-badge>
          </div>

          <div class="mobile-menu">
            <v-btn icon variant="text" @click="mobileMenu = !mobileMenu">
              <v-icon size="28">mdi-menu</v-icon>
            </v-btn>
          </div>
        </v-container>
      </v-app-bar>

      <!-- MOBILE DRAWER -->
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
            HOME <v-icon>mdi-arrow-up-right</v-icon>
          </a>

          <a href="#products" @click="mobileMenu = false">
            SHOP <v-icon>mdi-arrow-up-right</v-icon>
          </a>

          <NuxtLink to="/products" @click="mobileMenu = false">
            COLLECTIONS <v-icon>mdi-arrow-up-right</v-icon>
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
          <div class="mobile-menu-footer">Mikē</div>
        </template>
      </v-navigation-drawer>

      <!-- CART DRAWER -->
      <v-navigation-drawer
        v-model="cartDrawer"
        location="right"
        temporary
        width="480"
        class="cart-drawer"
      >
        <div class="cart-header">
          <div>
            <span class="cart-eyebrow">Mikē — YOUR SELECTION</span>
            <h2>
              YOUR CART <span>({{ cartItemCount }})</span>
            </h2>
          </div>

          <v-btn icon="mdi-close" variant="text" @click="cartDrawer = false" />
        </div>

        <v-divider />

        <!-- EMPTY CART -->
        <div v-if="cart.length === 0" class="empty-cart">
          <v-icon size="65" color="#aaa">mdi-shopping-outline</v-icon>
          <h3>Nothing here yet.</h3>
          <p>Your next favorite piece is waiting.</p>

          <v-btn
            to="/products"
            color="black"
            rounded="pill"
            class="mt-5"
            @click="cartDrawer = false"
          >
            EXPLORE COLLECTION
          </v-btn>
        </div>

        <!-- CART ITEMS -->
        <div v-else class="cart-content">
          <div class="cart-items">
            <div v-for="item in cart" :key="item.documentId" class="cart-item">
              <div class="cart-item-image">
                <v-img
                  v-if="getImageUrl(item.image)"
                  :src="getImageUrl(item.image)"
                  height="155"
                  cover
                />

                <v-icon v-else size="35">mdi-image-outline</v-icon>
              </div>

              <div class="cart-item-info">
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <span class="cart-item-category">
                      {{ item.category || "COLLECTION" }}
                    </span>

                    <h3>{{ item.name }}</h3>
                  </div>

                  <v-btn
                    icon="mdi-close"
                    size="x-small"
                    variant="text"
                    color="grey"
                    @click="removeFromCart(item.documentId)"
                  />
                </div>

                <div class="cart-item-price">
                  {{ formatPrice(item.price) }}
                </div>

                <div class="cart-item-bottom">
                  <div class="quantity-control">
                    <button
                      :disabled="item.quantity <= 1"
                      @click="decreaseQuantity(item.documentId)"
                    >
                      −
                    </button>

                    <span>{{ item.quantity }}</span>

                    <button
                      :disabled="item.quantity >= item.stock"
                      @click="increaseQuantity(item.documentId)"
                    >
                      +
                    </button>
                  </div>

                  <span class="cart-item-subtotal">
                    {{ formatPrice(item.price * item.quantity) }}
                  </span>
                </div>

                <span class="cart-stock"> {{ item.stock }} AVAILABLE </span>
              </div>
            </div>
          </div>

          <!-- SUMMARY -->
          <div class="cart-summary">
            <div class="cart-summary-top">
              <span>SUBTOTAL</span>
              <strong>{{ formatPrice(cartTotal) }}</strong>
            </div>

            <p>Shipping and taxes calculated at checkout.</p>

            <v-btn
              block
              color="black"
              height="56"
              rounded="pill"
              class="cart-checkout-btn"
              @click="openCheckout"
            >
              PROCEED TO CHECKOUT
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>

            <button class="continue-shopping" @click="cartDrawer = false">
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </v-navigation-drawer>

      <!-- CHECKOUT DIALOG -->
      <v-dialog v-model="checkoutDialog" max-width="1100" scrollable>
        <v-card class="checkout-card" rounded="xl">
          <!-- HEADER -->
          <div class="checkout-header">
            <div>
              <span class="checkout-eyebrow">Mikē — SECURE CHECKOUT</span>
              <h2>ALMOST YOURS.</h2>
              <p>Complete your details to place your order.</p>
            </div>

            <v-btn
              icon="mdi-close"
              variant="text"
              :disabled="isCheckingOut"
              @click="checkoutDialog = false"
            />
          </div>

          <v-divider />

          <v-card-text class="checkout-body">
            <v-row>
              <!-- CUSTOMER INFORMATION -->
              <v-col cols="12" md="7" class="checkout-form-column">
                <div class="checkout-step">
                  <span>01</span>
                  <h3>YOUR DETAILS</h3>
                </div>

                <v-text-field
                  v-model="customer.name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  variant="outlined"
                  rounded="lg"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.name"
                />

                <v-text-field
                  v-model="customer.email"
                  label="Email Address"
                  placeholder="you@example.com"
                  type="email"
                  variant="outlined"
                  rounded="lg"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.email"
                />

                <v-text-field
                  v-model="customer.phone"
                  label="Phone Number"
                  placeholder="09XXXXXXXXX"
                  variant="outlined"
                  rounded="lg"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.phone"
                />

                <v-textarea
                  v-model="customer.address"
                  label="Complete Shipping Address"
                  placeholder="House number, street, barangay, city, province..."
                  variant="outlined"
                  rounded="lg"
                  rows="3"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.address"
                />

                <div class="checkout-step mt-5">
                  <span>02</span>
                  <h3>PAYMENT METHOD</h3>
                </div>

                <v-radio-group
                  v-model="customer.paymentMethod"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.paymentMethod"
                  hide-details="auto"
                >
                  <div class="payment-option">
                    <v-radio value="COD">
                      <template #label>
                        <div class="payment-label">
                          <v-icon size="25">mdi-cash-multiple</v-icon>
                          <div>
                            <strong>Cash on Delivery</strong>
                            <small>Pay when your order arrives.</small>
                          </div>
                        </div>
                      </template>
                    </v-radio>
                  </div>

                  <div class="payment-option mt-3">
                    <v-radio value="GCash">
                      <template #label>
                        <div class="payment-label">
                          <v-icon size="25">mdi-cellphone</v-icon>
                          <div>
                            <strong>GCash</strong>
                            <small>Mobile wallet payment.</small>
                          </div>
                        </div>
                      </template>
                    </v-radio>
                  </div>
                </v-radio-group>
              </v-col>

              <!-- ORDER SUMMARY -->
              <v-col cols="12" md="5">
                <div class="checkout-summary">
                  <span class="checkout-summary-eyebrow"> YOUR SELECTION </span>

                  <h3>ORDER SUMMARY</h3>

                  <div
                    v-for="item in cart"
                    :key="item.documentId"
                    class="checkout-product"
                  >
                    <div class="checkout-product-image">
                      <v-img
                        v-if="getImageUrl(item.image)"
                        :src="getImageUrl(item.image)"
                        width="75"
                        height="85"
                        cover
                      />

                      <v-icon v-else>mdi-image-outline</v-icon>
                    </div>

                    <div class="checkout-product-info">
                      <strong>{{ item.name }}</strong>

                      <span>
                        {{ formatPrice(item.price) }} × {{ item.quantity }}
                      </span>
                    </div>

                    <strong class="checkout-product-total">
                      {{ formatPrice(item.price * item.quantity) }}
                    </strong>
                  </div>

                  <v-divider class="my-5" />

                  <div class="summary-line">
                    <span>TOTAL ITEMS</span>
                    <strong>{{ cartItemCount }}</strong>
                  </div>

                  <div class="summary-line">
                    <span>SUBTOTAL</span>
                    <strong>{{ formatPrice(cartTotal) }}</strong>
                  </div>

                  <div class="summary-line">
                    <span>SHIPPING</span>
                    <strong>Calculated separately</strong>
                  </div>

                  <v-divider class="my-5" />

                  <div class="checkout-total">
                    <span>TOTAL</span>
                    <strong>{{ formatPrice(cartTotal) }}</strong>
                  </div>

                  <p class="checkout-note">
                    Please review your information before placing your order.
                  </p>

                  <v-alert
                    v-if="checkoutError"
                    type="error"
                    variant="tonal"
                    class="mt-4"
                  >
                    {{ checkoutError }}
                  </v-alert>

                  <v-btn
                    block
                    color="black"
                    height="56"
                    rounded="pill"
                    class="mt-5"
                    :loading="isCheckingOut"
                    :disabled="cart.length === 0"
                    @click="submitCheckout"
                  >
                    PLACE YOUR ORDER
                    <v-icon end>mdi-arrow-right</v-icon>
                  </v-btn>

                  <div class="secure-checkout">
                    <v-icon size="16">mdi-shield-check-outline</v-icon>
                    YOUR ORDER DETAILS ARE PROTECTED
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- ORDER SUCCESS DIALOG -->
      <v-dialog v-model="successDialog" max-width="520" persistent>
        <v-card class="success-card" rounded="xl">
          <div class="success-icon">
            <v-icon size="48" color="white">mdi-check</v-icon>
          </div>

          <v-card-text class="text-center pa-8">
            <span class="success-eyebrow">Mikē — ORDER CONFIRMED</span>

            <h2 class="success-title mt-4">THANK YOU!</h2>

            <p class="success-message mt-3">
              Your order has been successfully placed. We appreciate your
              purchase and can't wait for you to receive your items.
            </p>

            <v-divider class="my-6" />

            <div class="order-reference">
              <span>YOUR ORDER NUMBER</span>
              <strong>{{ completedOrderId }}</strong>
            </div>

            <v-alert
              type="success"
              variant="tonal"
              rounded="lg"
              class="mt-5 text-left"
            >
              Thank you for shopping with Mikē. Your order is now being
              processed.
            </v-alert>

            <v-btn
              block
              color="black"
              size="x-large"
              rounded="pill"
              class="mt-6"
              @click="successDialog = false"
            >
              CONTINUE SHOPPING
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- HERO -->
      <section id="top" class="hero-section">
        <v-carousel
          height="840"
          cycle
          :interval="5000"
          show-arrows="hover"
          hide-delimiter-background
          color="white"
        >
          <v-carousel-item>
            <div class="hero-slide slide-one">
              <div class="hero-overlay"></div>

              <div class="hero-content">
                <span class="hero-eyebrow">THE NEW COLLECTION</span>

                <h1>MOVE<br />YOUR<br />WAY.</h1>

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

          <v-carousel-item>
            <div class="hero-slide slide-two">
              <div class="hero-overlay"></div>

              <div class="hero-content">
                <span class="hero-eyebrow">FIND YOUR STYLE</span>

                <h1>OWN<br />YOUR<br />LOOK.</h1>

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

          <v-carousel-item>
            <div class="hero-slide slide-three">
              <div class="hero-overlay"></div>

              <div class="hero-content">
                <span class="hero-eyebrow">MADE FOR EVERYDAY</span>

                <h1>LIVE<br />IN<br />STYLE.</h1>

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
      </v-container>

      <!-- PROMOTION -->
      <v-container class="section-spacing">
        <section class="promo-section">
          <div class="promo-content">
            <span class="eyebrow light-eyebrow">MADE FOR EVERYDAY</span>

            <h2>LESS ORDINARY.<br />MORE YOU.</h2>

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

      <!-- PRODUCTS -->
      <v-container id="products" class="section-spacing pb-12">
        <div class="section-header">
          <div>
            <span class="eyebrow">THE COLLECTION</span>
            <h2>FRESH FINDS.</h2>
            <p>Find your next everyday favorite.</p>
          </div>

          <NuxtLink to="/viewAllProducts" class="view-all-link">
            VIEW ALL
            <v-icon end>mdi-arrow-right</v-icon>
          </NuxtLink>
        </div>

        <!-- SEARCH -->
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
              aria-label="Clear search"
              @click="searchQuery = ''"
            >
              <v-icon icon="mdi-close" />
            </button>
          </div>

          <span class="search-caption">FIND SOMETHING YOU LOVE.</span>
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
        <v-row v-else class="product-grid mt-4">
          <v-col
            v-for="product in filteredProducts"
            :key="product.documentId"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="product-column"
          >
            <v-card
              class="product-card"
              rounded="0"
              elevation="0"
              height="100%"
            >
              <!-- IMAGE -->
              <div class="product-image">
                <v-img
                  v-if="getImageUrl(product.image)"
                  :src="getImageUrl(product.image)"
                  height="300"
                  cover
                />

                <div v-else class="image-placeholder">
                  <v-icon size="60">mdi-image-outline</v-icon>
                </div>

                <!-- WISHLIST -->
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

                <!-- STOCK -->
                <div v-if="product.stock > 0" class="product-tag">
                  AVAILABLE
                </div>

                <div v-else class="product-tag out-of-stock">SOLD OUT</div>
              </div>

              <!-- PRODUCT DETAILS -->
              <v-card-text class="product-details">
                <div class="product-heading">
                  <h3 class="product-name">{{ product.name }}</h3>

                  <p class="product-category">
                    {{ product.category || "EVERYDAY COLLECTION" }}
                  </p>
                </div>

                <div class="product-price">
                  {{ formatPrice(product.price) }}
                </div>

                <p class="product-description">
                  {{
                    product.description || "A fresh find for everyday living."
                  }}
                </p>
              </v-card-text>

              <!-- ADD TO CART -->
              <v-card-actions class="product-actions">
                <v-btn
                  class="add-to-cart-button"
                  color="black"
                  block
                  rounded="pill"
                  height="48"
                  :disabled="product.stock <= 0"
                  @click="addToCart(product)"
                >
                  ADD TO CART
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

              <h2>NEVER MISS<br />A THING.</h2>

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
              <div class="footer-logo">JP.</div>

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
            © {{ new Date().getFullYear() }} Mikē. ALL RIGHTS RESERVED.
          </div>
        </v-container>
      </v-footer>

      <!-- NOTIFICATION -->
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
  title: "Mikē",
  meta: [
    {
      name: "description",
      content: "Discover everyday essentials and timeless finds at Mikē.",
    },
    {
      name: "theme-color",
      content: "#F4F4F0",
    },
  ],
});

// STRAPI CONFIG
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

// DRAWERS
const cartDrawer = ref(false);
const mobileMenu = ref(false);

// CART
const cart = ref<CartItem[]>([]);

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

// SHARED PRODUCTS STATE
const products = useState<Product[]>("products", () => []);

// Sync initial API response to shared state
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

// INCREASE QUANTITY
function increaseQuantity(documentId: string) {
  const item = cart.value.find((item) => item.documentId === documentId);

  if (item && item.quantity < item.stock) {
    item.quantity++;
  }
}

// DECREASE QUANTITY
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


// CHECKOUT STATE
const checkoutDialog = ref(false);
const isCheckingOut = ref(false);
const checkoutError = ref("");

const successDialog = ref(false);
const completedOrderId = ref("");

const customer = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  paymentMethod: "COD",
});

const checkoutErrors = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  paymentMethod: "",
});

// OPEN CHECKOUT
function openCheckout() {
  if (cart.value.length === 0) {
    cartMessage.value = "Your cart is empty.";
    showCartMessage.value = true;
    return;
  }

  checkoutError.value = "";
  Object.keys(checkoutErrors).forEach((key) => {
    checkoutErrors[key as keyof typeof checkoutErrors] = "";
  });

  cartDrawer.value = false;
  checkoutDialog.value = true;
}

// CUSTOMER VALIDATION
function validateCheckout(): boolean {
  Object.keys(checkoutErrors).forEach((key) => {
    checkoutErrors[key as keyof typeof checkoutErrors] = "";
  });

  let valid = true;

  if (!customer.name.trim()) {
    checkoutErrors.name = "Full name is required.";
    valid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    checkoutErrors.email = "Enter a valid email address.";
    valid = false;
  }

  if (!customer.phone.trim() || customer.phone.trim().length < 7) {
    checkoutErrors.phone = "Enter a valid phone number.";
    valid = false;
  }

  if (!customer.address.trim()) {
    checkoutErrors.address = "Shipping address is required.";
    valid = false;
  }

  if (!["COD", "GCash"].includes(customer.paymentMethod)) {
    checkoutErrors.paymentMethod = "Select a payment method.";
    valid = false;
  }

  return valid;
}

// STRAPI REQUEST HELPER
async function strapiRequest(endpoint: string, method = "GET", body?: unknown) {
  const response = await fetch(`${STRAPI_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        result?.message ||
        `Strapi request failed: ${response.status}`,
    );
  }

  return result;
}

// SUBMIT CHECKOUT
async function submitCheckout() {
  checkoutError.value = "";

  if (!validateCheckout()) return;

  if (cart.value.length === 0) {
    checkoutError.value = "Your cart is empty.";
    return;
  }

  isCheckingOut.value = true;

  try {
    // STEP 1: RECHECK CURRENT PRODUCT DATA FROM STRAPI
    const verifiedItems = [];

    for (const item of cart.value) {
      const result = await strapiRequest(
        `/api/products/${encodeURIComponent(item.documentId)}?populate=image`,
      );

      const product = result.data;

      if (!product || !product.is_active) {
        throw new Error(`${item.name} is no longer available.`);
      }

      if (Number(product.stock) < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        );
      }

      verifiedItems.push({
        documentId: product.documentId,
        name: product.name,
        price: Number(product.price),
        stock: Number(product.stock),
        quantity: item.quantity,
      });
    }

    // STEP 2: COMPUTE TOTAL USING STRAPI PRICES
    const totalItems = verifiedItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    const totalAmount = Number(
      verifiedItems
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2),
    );

    // STEP 3: CREATE ORDER
    const orderResult = await strapiRequest("/api/orders", "POST", {
      data: {
        customerName: customer.name.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        shippingAddress: customer.address.trim(),
        paymentMethod: customer.paymentMethod,
        order_status: "Pending",
        totalAmount,
        totalItems,
      },
    });

    const orderId = orderResult.data?.documentId;

    if (!orderId) {
      throw new Error("Order was created without a document ID.");
    }

    // STEP 4: CREATE ORDER ITEMS
    for (const item of verifiedItems) {
      await strapiRequest("/api/order-items", "POST", {
        data: {
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: Number((item.price * item.quantity).toFixed(2)),
          product: {
            connect: [item.documentId],
          },
          order: {
            connect: [orderId],
          },
        },
      });
    }

    // STEP 5: DEDUCT PRODUCT STOCK AND PRESERVE IMAGE
    for (const item of verifiedItems) {
      // GET PRODUCT BEFORE UPDATE
      const before = await strapiRequest(
        `/api/products/${encodeURIComponent(item.documentId)}?populate=image`,
      );

      if (!before.data) {
        throw new Error(`Unable to fetch product: ${item.name}`);
      }

      const remainingStock = item.stock - item.quantity;
      const existingImageId = before.data.image?.id;

      // UPDATE STOCK AND PRESERVE EXISTING IMAGE
      await strapiRequest(
        `/api/products/${encodeURIComponent(item.documentId)}`,
        "PUT",
        {
          data: {
            stock: remainingStock,

            ...(existingImageId
              ? {
                  image: {
                    connect: [existingImageId],
                  },
                }
              : {}),
          },
        },
      );

      // FETCH UPDATED PRODUCT
      const updated = await strapiRequest(
        `/api/products/${encodeURIComponent(item.documentId)}?populate=image`,
      );

      if (!updated.data) {
        throw new Error(`Unable to fetch updated product: ${item.name}`);
      }

      // PRESERVE IMAGE IF NOT RETURNED BY STRAPI
      const productWithImage = {
        ...updated.data,
        image: updated.data.image || before.data.image,
      };

      // UPDATE SHARED FRONTEND STATE
      updateProductState(productWithImage);
    }

    // STEP 6: COMPLETE CHECKOUT
    cart.value = [];

    customer.name = "";
    customer.email = "";
    customer.phone = "";
    customer.address = "";
    customer.paymentMethod = "COD";

    checkoutDialog.value = false;

    completedOrderId.value = orderId;
    successDialog.value = true;

    // STEP 7: SUCCESS
    cart.value = [];

    customer.name = "";
    customer.email = "";
    customer.phone = "";
    customer.address = "";
    customer.paymentMethod = "COD";

    checkoutDialog.value = false;

    completedOrderId.value = orderId;
    successDialog.value = true;
  } catch (error: any) {
    console.error("CHECKOUT ERROR:", error);

    checkoutError.value =
      error?.message || "Something went wrong during checkout.";
  } finally {
    isCheckingOut.value = false;
  }
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

// PRICE FORMAT
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

  cartMessage.value = "Welcome to the Mikē community!";
  showCartMessage.value = true;
  newsletterEmail.value = "";
}
</script>

<style scoped>
/* BASE */
.nike-style {
  background: #f4f4f0;
  color: #111;
  min-height: 100vh;
}

.loading-page {
  min-height: 100vh;
  padding: 40px;
}

:global(html) {
  scroll-behavior: smooth;
}

#products,
#categories,
#top {
  scroll-margin-top: 85px;
}

/* ANNOUNCEMENT */
.announcement-bar {
  background: #111;
  color: white;
  text-align: center;
  padding: 9px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

/* NAVBAR */
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

.mobile-menu {
  display: none;
}

@media (max-width: 960px) {
  .desktop-navigation,
  .desktop-cart {
    display: none !important;
  }

  .mobile-menu {
    display: flex !important;
    align-items: center;
  }
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

/* HERO */
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

.slide-one {
  background-image: url("https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1800&q=85");
  background-position: center 35%;
}

.slide-two {
  background-image: url("https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1800&q=85");
}

.slide-three {
  background-image: url("https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=85");
}

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

.hero-content {
  position: relative;
  z-index: 2;
  color: white;
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
  color: #111 !important;
  font-weight: 800;
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

/* SECTIONS */
.section-spacing {
  padding-top: 55px;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 15px;
}

.section-header h2 {
  font-size: clamp(25px, 4vw, 36px);
  font-weight: 1000;
  letter-spacing: -1.5px;
  line-height: 1.15;
  margin-top: 8px;
}

.section-header p {
  color: #777;
  margin-top: 8px;
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
  color: #ccc;
  margin-top: 15px;
  margin-bottom: 25px;
  max-width: 430px;
  line-height: 1.7;
}

/* SEARCH */
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
  background: white;
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

/* PRODUCT GRID */
.product-grid {
  align-items: stretch;
}

.product-column {
  display: flex;
}

/* PRODUCT CARD */
.product-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 18px !important;
  overflow: hidden;
  border: 1px solid #eeeeee;
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.09);
}

/* IMAGE */
.product-image {
  position: relative;
  flex-shrink: 0;
  background: #f5f5f2;
  overflow: hidden;
  border-radius: 14px;
  margin: 10px;
}

.product-image :deep(.v-img) {
  transition: transform 0.5s ease;
}

.product-image :deep(.v-img img) {
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.3, 1);
  object-fit: contain;
}

.product-card:hover .product-image :deep(.v-img img) {
  transform: scale(1.06);
}

.image-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f2;
}

/* WISHLIST */
.wishlist-button {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  background: #fff !important;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease;
}

.wishlist-button:hover {
  transform: scale(1.12);
}

/* STOCK BADGE */
.product-tag {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: #fff;
  color: #111;
  padding: 8px 12px;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.2px;
  border-radius: 4px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
}

.out-of-stock {
  background: #111;
  color: #fff;
}

/* PRODUCT DETAILS */
.product-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 14px 16px 10px !important;
}

.product-heading {
  min-height: 69px;
}

.product-name {
  font-size: 15px;
  font-weight: 800;
  color: #171717;
  line-height: 1.4;
  letter-spacing: -0.3px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.product-category {
  color: #999;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-top: 5px;
  line-height: 1.4;
  min-height: 14px;
}

.product-price {
  color: #111;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.5px;
  margin-top: 13px;
  line-height: 1.3;
}

.product-description {
  color: #777;
  font-size: 12px;
  line-height: 1.7;
  margin-top: 9px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 41px;
}

/* ADD TO CART */
.product-actions {
  padding: 8px 16px 18px !important;
  margin-top: auto;
}

.add-to-cart-button {
  background: #111 !important;
  color: #fff !important;
  font-size: 12px !important;
  font-weight: 900 !important;
  letter-spacing: 1px !important;
  border: 1px solid #111 !important;
  transition: all 0.25s ease !important;
}

.add-to-cart-button:hover {
  background: #333 !important;
  border-color: #333 !important;
  transform: translateY(-2px);
}

.add-to-cart-button:disabled {
  background: #d5d5d5 !important;
  color: #777 !important;
  border-color: #d5d5d5 !important;
  opacity: 1 !important;
}

/* =================================
   PREMIUM CART DRAWER
================================= */

.cart-drawer {
  max-width: 100vw;
  background: #f8f8f4;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 25px;
}

.cart-eyebrow,
.checkout-eyebrow {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #999;
}

.cart-header h2 {
  font-size: 27px;
  font-weight: 1000;
  letter-spacing: -1.5px;
  margin-top: 8px;
}

.cart-header h2 span {
  color: #999;
  font-size: 16px;
}

.cart-content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 95px);
  min-height: 0;
}

.cart-items {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: 125px 1fr;
  gap: 16px;
  padding-bottom: 22px;
  margin-bottom: 22px;
  border-bottom: 1px solid #e5e5df;
}

.cart-item-image {
  height: 155px;
  background: #edede8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 10px;
}

.cart-item-info {
  min-width: 0;
}

.cart-item-category {
  color: #999;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.cart-item-info h3 {
  font-size: 14px;
  font-weight: 800;
  line-height: 1.4;
  margin-top: 5px;
}

.cart-item-price {
  font-size: 15px;
  font-weight: 900;
  margin-top: 13px;
}

.cart-item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 15px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 13px;
  border: 1px solid #ddd;
  border-radius: 30px;
  padding: 5px 10px;
  background: white;
}

.quantity-control button {
  border: none;
  background: transparent;
  font-size: 19px;
  cursor: pointer;
  color: #111;
}

.quantity-control button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.quantity-control span {
  font-size: 12px;
  font-weight: 800;
}

.cart-item-subtotal {
  font-size: 11px;
  font-weight: 800;
}

.cart-stock {
  display: block;
  margin-top: 10px;
  font-size: 9px;
  color: #999;
  letter-spacing: 1px;
  font-weight: 800;
}

.cart-summary {
  flex-shrink: 0;
  padding: 23px 25px;
  background: #fff;
  border-top: 1px solid #e5e5df;
}

.cart-summary-top {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 900;
}

.cart-summary p {
  color: #999;
  font-size: 11px;
  margin-top: 9px;
  margin-bottom: 20px;
}

.cart-checkout-btn {
  font-size: 11px !important;
  font-weight: 900 !important;
  letter-spacing: 1px;
}

.continue-shopping {
  display: block;
  margin: 17px auto 0;
  border: none;
  background: transparent;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1px;
  cursor: pointer;
}

.empty-cart {
  text-align: center;
  padding: 90px 25px;
  color: #777;
}

.empty-cart h3 {
  color: #111;
  font-size: 22px;
  font-weight: 900;
  margin-top: 20px;
}

/* =================================
   PREMIUM CHECKOUT
================================= */

.checkout-card {
  background: #f8f8f4;
  overflow: hidden;
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 35px;
}

.checkout-header h2 {
  font-size: clamp(25px, 4vw, 36px);
  font-weight: 1000;
  letter-spacing: -2px;
  margin-top: 8px;
}

.checkout-header p {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

.checkout-body {
  padding: 30px 35px !important;
}

.checkout-form-column {
  padding-right: 35px;
}

.checkout-step {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 22px;
}

.checkout-step span {
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #111;
  color: white;
  font-size: 11px;
  font-weight: 900;
}

.checkout-step h3 {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
}

.checkout-form-column :deep(.v-field) {
  background: white;
}

.payment-option {
  padding: 13px;
  background: white;
  border: 1px solid #e5e5df;
  border-radius: 12px;
}

.payment-label {
  display: flex;
  align-items: center;
  gap: 13px;
  color: #111;
  padding: 5px;
}

.payment-label strong,
.payment-label small {
  display: block;
}

.payment-label strong {
  font-size: 12px;
  font-weight: 900;
}

.payment-label small {
  font-size: 10px;
  color: #888;
  margin-top: 4px;
}

/* ORDER SUMMARY */

.checkout-summary {
  background: white;
  border: 1px solid #e9e9e3;
  border-radius: 15px;
  padding: 25px;
  height: 100%;
}

.checkout-summary-eyebrow {
  font-size: 9px;
  color: #999;
  font-weight: 900;
  letter-spacing: 1.5px;
}

.checkout-summary > h3 {
  font-size: 20px;
  font-weight: 1000;
  letter-spacing: -0.7px;
  margin-top: 7px;
  margin-bottom: 20px;
}

.checkout-product {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.checkout-product-image {
  width: 65px;
  height: 75px;
  flex-shrink: 0;
  background: #f0f0eb;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
}

.checkout-product-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 6px;
}

.checkout-product-info strong {
  font-size: 11px;
  line-height: 1.4;
}

.checkout-product-info span {
  font-size: 10px;
  color: #999;
}

.checkout-product-total {
  font-size: 11px;
  white-space: nowrap;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  font-size: 11px;
  color: #777;
}

.summary-line strong {
  color: #111;
  text-align: right;
}

.checkout-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 900;
}

.checkout-total strong {
  font-size: 23px;
  letter-spacing: -1px;
}

.checkout-note {
  color: #999;
  font-size: 10px;
  line-height: 1.7;
  margin-top: 15px;
}

.secure-checkout {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  color: #999;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
  margin-top: 17px;
}

/* MOBILE */

@media (max-width: 600px) {
  .cart-item {
    grid-template-columns: 105px 1fr;
    gap: 12px;
  }

  .cart-item-image {
    height: 140px;
  }

  .cart-header {
    padding: 23px 18px;
  }

  .cart-items {
    padding: 15px;
  }

  .cart-summary {
    padding: 18px;
  }

  .checkout-header {
    padding: 22px 18px;
  }

  .checkout-body {
    padding: 18px !important;
  }

  .checkout-form-column {
    padding-right: 12px;
  }

  .checkout-summary {
    padding: 20px 15px;
  }

  .checkout-total strong {
    font-size: 20px;
  }
}

/* ORDER SUCCESS */
.success-card {
  background: #f9f9f6;
  overflow: hidden;
}

.success-icon {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 35px auto 0;
}

.success-eyebrow {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #888;
}

.success-title {
  font-size: 42px;
  font-weight: 1000;
  letter-spacing: -2px;
  color: #111;
}

.success-message {
  color: #777;
  font-size: 14px;
  line-height: 1.8;
}

.order-reference {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  background: #eeeeea;
  border-radius: 12px;
}

.order-reference span {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #888;
}

.order-reference strong {
  font-size: 19px;
  color: #111;
  word-break: break-all;
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
  color: #555;
  margin-top: 18px;
  max-width: 400px;
  line-height: 1.7;
}

/* FOOTER */
.main-footer {
  background: #111;
  color: #fff;
}

.footer-logo {
  font-size: 65px;
  font-weight: 1000;
  letter-spacing: -7px;
}

.footer-description {
  color: #aaa;
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
  color: #aaa;
  font-size: 13px;
}

.footer-links a:hover {
  color: #fff;
}

.footer-bottom {
  color: #888;
  font-size: 10px;
  letter-spacing: 1px;
}

/* MOBILE RESPONSIVE */
@media (max-width: 600px) {
  .brand-logo {
    font-size: 34px;
  }

  .hero-slide {
    min-height: 540px;
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

  .section-header h2 {
    font-size: 25px;
  }

  .product-card {
    border-radius: 13px !important;
  }

  .product-image {
    margin: 7px;
    border-radius: 10px;
  }

  .product-image :deep(.v-img) {
    height: 220px !important;
  }

  .image-placeholder {
    height: 220px;
  }

  .product-details {
    padding: 12px 12px 8px !important;
  }

  .product-heading {
    min-height: 64px;
  }

  .product-name {
    font-size: 13px;
    min-height: 36px;
  }

  .product-price {
    font-size: 16px;
    margin-top: 10px;
  }

  .product-description {
    font-size: 11px;
    min-height: 38px;
  }

  .product-actions {
    padding: 8px 12px 14px !important;
  }

  .add-to-cart-button {
    font-size: 10px !important;
    height: 44px !important;
  }

  .product-tag {
    font-size: 8px;
    padding: 6px 9px;
  }

  .wishlist-button {
    top: 8px;
    right: 8px;
  }

  .newsletter-section h2 {
    font-size: 45px;
  }

  .cart-product-name {
    font-size: 13px;
  }

  .cart-product-price {
    font-size: 14px;
  }

  .cart-summary {
    padding-bottom: 20px;
  }
}
</style>
