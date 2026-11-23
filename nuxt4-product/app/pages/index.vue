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
          <NuxtLink to="/" class="brand-logo"> Mikē<span>.</span> </NuxtLink>

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
              color="black"
            >
              <v-btn icon variant="text" @click="cartDrawer = true">
                CART
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

      <!-- MOBILE MENU -->
      <v-navigation-drawer
        v-model="mobileMenu"
        location="right"
        temporary
        width="300"
        class="mobile-navigation"
      >
        <div class="mobile-menu-header">
          <span>MENU</span>
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
              color="black"
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

        <div v-else class="cart-content">
          <div class="cart-items">
            <div v-for="item in cart" :key="item.documentId" class="cart-item">
              <div class="cart-item-image">
                <v-img
                  v-if="getImageURL(item.image, STRAPI_URL)"
                  :src="getImageURL(item.image, STRAPI_URL)"
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

                <span class="cart-stock">{{ item.stock }} AVAILABLE</span>
              </div>
            </div>
          </div>

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

      <!-- CHECKOUT -->
      <v-dialog v-model="checkoutDialog" max-width="1100" scrollable>
        <v-card class="checkout-card" rounded="xl">
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

              <v-col cols="12" md="5">
                <div class="checkout-summary">
                  <span class="checkout-summary-eyebrow">YOUR SELECTION</span>
                  <h3>ORDER SUMMARY</h3>

                  <div
                    v-for="item in cart"
                    :key="item.documentId"
                    class="checkout-product"
                  >
                    <div class="checkout-product-image">
                      <v-img
                        v-if="getImageURL(item.image, STRAPI_URL)"
                        :src="getImageURL(item.image, STRAPI_URL)"
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

      <!-- ORDER SUCCESS -->
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

      <!-- HERO CAROUSEL -->
      <section id="top" class="hero-section scroll-reveal">
        <v-carousel
          height="760"
          cycle
          :interval="5000"
          show-arrows="hover"
          hide-delimiter-background
          color="white"
        >
          <v-carousel-item v-for="slide in heroSlides" :key="slide.number">
            <div class="hero-slide" :class="slide.class">
              <div class="hero-overlay" />

              <div class="hero-content">
                <div class="hero-accent-line" />
                <span class="hero-eyebrow">{{ slide.eyebrow }}</span>
                <h1 v-html="slide.heading" />
                <p>{{ slide.description }}</p>

                <v-btn
                  href="#products"
                  color="white"
                  rounded="pill"
                  size="x-large"
                  class="hero-button"
                >
                  {{ slide.button }}
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </div>

              <div class="hero-bottom-label">
                {{ slide.number }} — {{ slide.label }}
              </div>
            </div>
          </v-carousel-item>
        </v-carousel>
      </section>

      <!-- CATEGORIES -->
      <section class="scroll-reveal">
        <v-container id="categories" class="section-spacing">
          <div class="section-header">
            <div>
              <span class="eyebrow">EXPLORE THE COLLECTION</span>
              <h2>SHOP BY CATEGORY.</h2>
              <p>Find the perfect essentials for your everyday life.</p>
            </div>
          </div>

          <div class="category-showcase">
            <button
              v-for="(category, index) in categories"
              :key="category"
              class="category-showcase-card"
              @click="selectCategory(category)"
            >
              <span class="category-number">
                {{ String(index + 1).padStart(2, "0") }}
              </span>

              <div class="category-card-content">
                <h3>{{ category }}</h3>
                <span>EXPLORE COLLECTION</span>
              </div>

              <v-icon class="category-arrow">mdi-arrow-up-right</v-icon>
            </button>
          </div>
        </v-container>
      </section>

      <!-- PROMOTION -->
      <v-container class="section-spacing">
        <section class="promo-section">
          <div class="promo-content scroll-reveal">
            <span class="eyebrow light-eyebrow">THE Mikē EXPERIENCE</span>

            <h2>LESS ORDINARY.<br />MORE YOU.</h2>

            <p>
              Discover products that bring style and simplicity into your
              everyday life.
            </p>

            <v-btn
              to="/products"
              color="white"
              rounded="pill"
              size="large"
              class="promo-button"
            >
              EXPLORE COLLECTION
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </div>

          <div class="promo-decoration">
            <span>MIKĒ</span>
            <v-icon size="115">mdi-star-four-points-outline</v-icon>
          </div>
        </section>
      </v-container>

      <!-- PRODUCTS -->
      <v-container id="products" class="section-spacing pb-12">
        <div class="section-header product-section-header">
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

        <section class="scroll-reveal">
          <!-- FILTER -->
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

          <v-alert v-if="error" type="warning" variant="tonal" class="mt-6">
            Unable to load products. Please check your Strapi connection.
          </v-alert>

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
                <div class="product-image">
                  <v-img
                    v-if="getImageURL(product.image, STRAPI_URL)"
                    :src="getImageURL(product.image, STRAPI_URL)"
                    height="300"
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
                        isWishlisted(product)
                          ? "mdi-heart"
                          : "mdi-heart-outline"
                      }}
                    </v-icon>
                  </v-btn>

                  <div
                    class="product-tag"
                    :class="{ 'out-of-stock': product.stock <= 0 }"
                  >
                    {{ product.stock > 0 ? "AVAILABLE" : "SOLD OUT" }}
                  </div>
                </div>

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
        </section>
      </v-container>

      <!-- NEWSLETTER -->
      <section class="newsletter-section">
        <v-container class="py-12 scroll-reveal">
          <v-row align="center">
            <v-col cols="12" md="6">
              <span class="eyebrow">STAY IN THE GAME</span>
              <h2>NEVER MISS<br />A THING.</h2>
              <p>Get the latest updates, new arrivals, and exclusive offers.</p>
            </v-col>

            <v-col cols="12" md="6">
              <v-form
                class="newsletter-form"
                @submit.prevent="handleNewsletterSubmit"
              >
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
              <div class="footer-logo">Mikē<span>.</span></div>

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
import { heroSlides } from "~/composables/heroSlides";
import { formatPrice } from "~/utils/formatPrice";
import { getImageURL } from "~/utils/getImageURL";
import { strapiRequest } from "~/utils/strapiRequest";


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

// DRAWERS
const cartDrawer = ref(false);
const mobileMenu = ref(false);

// FETCH PRODUCTS
const { pending, error, STRAPI_URL, products, updateProductState } =
  useProducts();

// Cart Item
const {
  cart,
  cartItemCount,
  cartMessage,
  cartTotal,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  showCartMessage,
} = useCarts();

// Wishlish
const { toggleWishlist, isWishlisted } = useWishlist();

// Newsletter
const { newsletterEmail, emailRules, subscribeNewsletter } = useNewsLetter();

// Newsletter handler
function handleNewsletterSubmit() {
  cartMessage.value = subscribeNewsletter();
  showCartMessage.value = true;
}

// ========================================
// SCROLL REVEAL
// ========================================

const { initializeScrollReveal } = useScrollReveal();

// IMPORTANT:
// Your page uses v-if="pending", so the sections are not
// available when onMounted initially runs.
// Wait until loading finishes before observing them.

watch(
  pending,
  async (isPending) => {
    if (!isPending) {
      await nextTick();
      initializeScrollReveal();
    }
  },
  { immediate: true, flush: "post" },
);

onMounted(async () => {
  await nextTick();

  if (!pending.value) {
    initializeScrollReveal();
  }
});

// CATEGORY CLICK
function scrollToProducts() {
  document.getElementById("products")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function selectCategory(category: string) {
  selectedCategory.value = category;
  scrollToProducts();
}

const { filteredProducts, searchQuery, selectedCategory, categories } =
  useProductFilters(products);

// CHECKOUT
const checkoutDialog = ref(false);
const isCheckingOut = ref(false);

const successDialog = ref(false);
const completedOrderId = ref("");

const {
  checkoutError,
  customer,
  checkoutErrors,
  clearCheckoutErrors,
  validateCheckout,
  resetCustomer,
} = useCheckoutValidation();

function openCheckout() {
  if (cart.value.length === 0) {
    cartMessage.value = "Your cart is empty.";
    showCartMessage.value = true;
    return;
  }

  checkoutError.value = "";
  clearCheckoutErrors();

  cartDrawer.value = false;
  checkoutDialog.value = true;
}

// STRAPI REQUEST
const { request } = strapiRequest(STRAPI_URL);

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
    // STEP 1: VERIFY PRODUCTS AND STOCK
    const verifiedItems = [];

    for (const item of cart.value) {
      const result = await request(
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

    // STEP 2: COMPUTE TOTAL
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
    const orderResult = await request("/api/orders", "POST", {
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
      await request("/api/order-items", "POST", {
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

    // STEP 5: DEDUCT STOCK AND PRESERVE IMAGE
    for (const item of verifiedItems) {
      const before = await request(
        `/api/products/${encodeURIComponent(item.documentId)}?populate=image`,
      );

      if (!before.data) {
        throw new Error(`Unable to fetch product: ${item.name}`);
      }

      const remainingStock = item.stock - item.quantity;
      const existingImageId = before.data.image?.id;

      await request(
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

      const updated = await request(
        `/api/products/${encodeURIComponent(item.documentId)}?populate=image`,
      );

      if (!updated.data) {
        throw new Error(`Unable to fetch updated product: ${item.name}`);
      }

      const productWithImage = {
        ...updated.data,
        image: updated.data.image || before.data.image,
      };

      updateProductState(productWithImage);
    }

    // STEP 6: COMPLETE CHECKOUT
    cart.value = [];
    resetCustomer();

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
</script>

<style scoped>
@import "~/assets/css/main.css";
</style>
