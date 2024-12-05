<template>
  <header class="header">
    <div class="container">
      <nav class="nav">
        <div class="nav-brand">
          <RouterLink to="/">Home</RouterLink>
        </div>
        
        <div class="nav-logo">
          <RouterLink to="/">.369</RouterLink>
        </div>
        
        <div class="nav-menu">
          <template v-if="isLoggedIn">
            <RouterLink to="/profile" class="profile-button">
              <i class="ri-user-line"></i>
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink to="/auth" class="nav-link">Auth</RouterLink>
          </template>
        </div>
        
        <div v-if="isLoggedIn" class="header-actions">
          <RouterLink to="/cart" class="cart-button">
            <div class="cart-icon">
              <i class="ri-shopping-cart-2-line"></i>
              <span v-if="cartItemCount > 0" class="cart-badge">
                {{ cartItemCount }}
              </span>
            </div>
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref, onMounted, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCartStore } from '@/stores/cart';

const router = useRouter();
const cartStore = useCartStore();
const { itemCount: cartItemCount } = storeToRefs(cartStore);

const isLoggedIn = computed(() => {
  return window.sessionStorage.getItem('logined') === 'true';
});

onMounted(() => {
  if (isLoggedIn.value) {
    cartStore.updateCartCount();
  }
});

watch(() => router.currentRoute.value.path, () => {
  if (isLoggedIn.value) {
    cartStore.updateCartCount();
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
  0% { transform: scale(0.85); }
  50% { transform: scale(0.95); }
  100% { transform: scale(0.85); }
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
</style>
