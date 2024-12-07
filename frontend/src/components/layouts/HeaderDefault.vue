<template>
  <header class="header">
    <div class="container">
      <nav class="nav">
        <div class="nav-brand">
          <RouterLink to="/">{{
            $t("Components.Layouts.HeaderDefault.Home")
          }}</RouterLink>
        </div>

        <div class="nav-logo">
          <RouterLink to="/">.369</RouterLink>
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
          </template>
          <template v-else>
            <RouterLink to="/auth" class="nav-link">{{
              $t("Components.Layouts.HeaderDefault.Auth")
            }}</RouterLink>
          </template>

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
import { onMounted, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useCartStore } from "@/stores/cart";

const router = useRouter();
const cartStore = useCartStore();
const { itemCount: cartItemCount } = storeToRefs(cartStore);

const isLoggedIn = computed(() => {
  return window.sessionStorage.getItem("logined") === "true";
});

onMounted(() => {
  if (isLoggedIn.value) {
    cartStore.updateCartCount();
  }
});
watch(
  () => router.currentRoute.value.path,
  () => {
    if (isLoggedIn.value) {
      cartStore.updateCartCount();
    }
  }
);
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
</style>
