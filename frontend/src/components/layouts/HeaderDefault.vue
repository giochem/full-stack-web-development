<template>
  <header class="header">
    <div class="container">
      <nav class="nav">
        <div class="nav-brand">
          <RouterLink to="/">{{
            $t("Components.Layouts.HeaderDefault.Home")
          }}</RouterLink>
        </div>
        <div class="nav-brand">
          <RouterLink to="/category">{{
            $t("Components.Layouts.HeaderDefault.Category")
          }}</RouterLink>
        </div>
        <div class="nav-logo">
          <RouterLink to="/">{{
            $t("Components.Layouts.HeaderDefault.NameStore")
          }}</RouterLink>
        </div>

        <div class="nav-menu">
          <template v-if="isLoggedIn">
            <RouterLink to="/profile" class="profile-button">
              <i class="ri-user-line"></i>
            </RouterLink>
            <RouterLink to="/cart" class="cart-button">
              <div class="cart-icon">
                <i class="ri-shopping-cart-2-line"></i>
                <span v-if="cartItemCount > 0" class="cart-badge">
                  {{ cartItemCount }}
                </span>
              </div>
            </RouterLink>
            <button
              @click="handleLogout"
              class="action-button logout"
              :disabled="isLoggingOut"
            >
              <i class="ri-logout-box-line"></i>
              <span class="button-text">{{
                isLoggingOut
                  ? $t("Components.Layouts.HeaderDefault.LoggingOut")
                  : $t("Components.Layouts.HeaderDefault.Logout")
              }}</span>
            </button>
          </template>
          <template v-else>
            <RouterLink to="/auth" class="action-button login">
              <i class="ri-login-box-line"></i>
              <span class="button-text">
                {{ $t("Components.Layouts.HeaderDefault.Auth") }}
              </span>
            </RouterLink>
          </template>

          <RouterLink to="/search" class="search-button">
            <i class="ri-search-line"></i>
          </RouterLink>

          <div class="lang-selector">
            <button
              class="lang-btn"
              :class="{ active: $i18n.locale === 'vn' }"
              @click="$i18n.locale = 'vn'"
            >
              <i class="ri-flag-fill"></i> VN
            </button>
            <button
              class="lang-btn"
              :class="{ active: $i18n.locale === 'en' }"
              @click="$i18n.locale = 'en'"
            >
              <i class="ri-flag-2-fill"></i> EN
            </button>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";
import { onMounted, watch, computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCartStore } from "@/stores/cart";
import axios from "@/utils/axios";
const router = useRouter();
const cartStore = useCartStore();
const { itemCount: cartItemCount } = storeToRefs(cartStore);
const isLoggingOut = ref(false);

const isLoggedIn = computed(() => {
  return window.sessionStorage.getItem("logined") === "true";
});

async function handleLogout() {
  try {
    isLoggingOut.value = true;
    await axios.post(
      "/auth/logout",
      {},
      {
        withCredentials: true
      }
    );

    // Clear session storage
    window.sessionStorage.removeItem("logined");

    // Reset cart count
    cartStore.itemCount = 0;

    // Redirect to home page
    router.push("/");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    isLoggingOut.value = false;
  }
}

// Update cart count when component mounts and user is logged in
onMounted(async () => {
  if (isLoggedIn.value) {
    await cartStore.updateCartCount();
  }
});

// Update cart count when route changes and user is logged in
watch(
  () => router.currentRoute.value.path,
  async () => {
    if (isLoggedIn.value) {
      await cartStore.updateCartCount();
    }
  }
);

// Also watch login status to update cart count
watch(isLoggedIn, async (newValue) => {
  if (newValue) {
    await cartStore.updateCartCount();
  } else {
    cartStore.itemCount = 0;
  }
});
</script>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.nav-brand a,
.nav-logo a,
.nav-link {
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-brand a:hover,
.nav-logo a:hover,
.nav-link:hover {
  color: #42b983;
}

.nav-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
}

@media (max-width: 768px) {
  .nav {
    height: 50px;
  }

  .nav-menu {
    gap: 1rem;
  }
}

.cart-button {
  position: relative;
  padding: 0.5rem;
  color: var(--secondary-dark-color);
  text-decoration: none;
  transition: color 0.3s;
}

.cart-button:hover {
  color: var(--primary-color);
}

.cart-icon {
  position: relative;
  font-size: 1.5rem;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -12px;
  background: var(--primary-color);
  color: white;
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.15rem 0.35rem;
  border-radius: 1rem;
  min-width: 1.2rem;
  text-align: center;
  transform: scale(0.85);
}

/* Optional: Animation for badge */
@keyframes pulse {
  0% {
    transform: scale(0.85);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(0.85);
  }
}

.cart-badge {
  animation: pulse 0.3s ease-in-out;
}

.profile-button {
  position: relative;
  padding: 0.5rem;
  color: var(--secondary-dark-color);
  text-decoration: none;
  transition: color 0.3s;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}

.profile-button:hover {
  color: var(--primary-color);
}

.lang-selector {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background: #f5f5f5;
  padding: 0.25rem;
  border-radius: 0.5rem;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  color: #666;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.lang-btn:hover {
  background: #e0e0e0;
}

.lang-btn.active {
  background: white;
  color: var(--primary-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.lang-btn i {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .lang-btn {
    padding: 0.25rem;
  }

  .lang-btn span {
    display: none;
  }
}

/* Add new shared button styles */
.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 2px solid;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
}

.action-button i {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.action-button:hover i {
  transform: translateX(2px);
}

/* Login button specific styles */
.action-button.login {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.action-button.login:hover {
  background: var(--primary-color);
  color: white;
}

/* Logout button specific styles */
.action-button.logout {
  border-color: #fecaca;
  color: #ef4444;
}

.action-button.logout:hover:not(:disabled) {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.action-button.logout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #fef2f2;
}

.button-text {
  display: none;
}

/* Show button text on larger screens */
@media (min-width: 768px) {
  .button-text {
    display: inline;
  }

  .action-button {
    margin-left: 1rem;
  }
}

.search-button {
  padding: 0.5rem;
  color: var(--secondary-dark-color);
  text-decoration: none;
  transition: color 0.3s;
}

.search-button:hover {
  color: var(--primary-color);
}
</style>
