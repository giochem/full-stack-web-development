<template>
  <aside class="admin-sidebar">
    <nav class="sidebar-nav">
      <div class="sidebar-header">
        <h1 class="brand">
          {{ $t("Components.Layouts.NavbarAdmin.Brand") }}
        </h1>
      </div>

      <ul class="nav-list">
        <li class="nav-item">
          <RouterLink
            to="/admin"
            class="nav-link"
            :class="{ active: currentPath === '/admin' }"
            exact
          >
            <i class="ri-dashboard-line"></i>
            <span>{{ $t("Components.Layouts.NavbarAdmin.Dashboard") }}</span>
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/admin/manage-user"
            class="nav-link"
            :class="{ active: currentPath === '/admin/manage-user' }"
          >
            <i class="ri-user-line"></i>
            <span>{{ $t("Components.Layouts.NavbarAdmin.Users") }}</span>
          </RouterLink>
        </li>

        <li class="nav-group">
          <span class="nav-group-title">{{
            $t("Components.Layouts.NavbarAdmin.Products")
          }}</span>
          <ul class="nav-sublist">
            <li class="nav-item">
              <RouterLink
                to="/admin/manage-product"
                class="nav-link"
                :class="{ active: currentPath === '/admin/manage-product' }"
              >
                <i class="ri-shopping-bag-line"></i>
                <span>{{ $t("Components.Layouts.NavbarAdmin.Products") }}</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink
                to="/admin/manage-variations"
                class="nav-link"
                :class="{ active: currentPath === '/admin/manage-variations' }"
              >
                <i class="ri-list-settings-line"></i>
                <span>{{
                  $t("Components.Layouts.NavbarAdmin.Variations")
                }}</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink
                to="/admin/manage-category"
                class="nav-link"
                :class="{ active: currentPath === '/admin/manage-category' }"
              >
                <i class="ri-folder-2-line"></i>
                <span>{{
                  $t("Components.Layouts.NavbarAdmin.Categories")
                }}</span>
              </RouterLink>
            </li>
          </ul>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/admin/manage-promotion"
            class="nav-link"
            :class="{ active: currentPath === '/admin/manage-promotion' }"
          >
            <i class="ri-price-tag-3-line"></i>
            <span>{{ $t("Components.Layouts.NavbarAdmin.Promotions") }}</span>
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/admin/manage-cart"
            class="nav-link"
            :class="{ active: currentPath === '/admin/manage-cart' }"
          >
            <i class="ri-shopping-cart-line"></i>
            <span>{{ $t("Components.Layouts.NavbarAdmin.Carts") }}</span>
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/admin/manage-order"
            class="nav-link"
            :class="{ active: currentPath === '/admin/manage-order' }"
          >
            <i class="ri-file-list-line"></i>
            <span>{{ $t("Components.Layouts.NavbarAdmin.Orders") }}</span>
          </RouterLink>
        </li>
      </ul>

      <div class="sidebar-footer">
        <button
          @click="handleLogout"
          class="logout-btn"
          :disabled="isLoggingOut"
        >
          <i class="ri-logout-box-line"></i>
          <span>{{
            isLoggingOut
              ? $t("Components.Layouts.NavbarAdmin.LoggingOut")
              : $t("Components.Layouts.NavbarAdmin.Logout")
          }}</span>
        </button>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/utils/axios";

const route = useRoute();
const router = useRouter();
const currentPath = computed(() => route.path);
const isLoggingOut = ref(false);

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

    // Redirect to login page
    router.push("/auth");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    isLoggingOut.value = false;
  }
}
</script>

<style scoped>
.admin-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 250px;
  height: 100vh;
  background-color: white;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.sidebar-nav {
  padding: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav-list {
  flex: 1;
  padding: 1rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: var(--secondary-dark-color);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  background-color: var(--light-bg-color);
  color: var(--primary-color);
}

.nav-link i {
  font-size: 1.25rem;
}

.nav-link span {
  font-weight: 500;
  text-transform: capitalize;
}

.nav-group {
  margin: 0.5rem 0;
}

.nav-group-title {
  display: block;
  padding: 0.5rem 1.5rem;
  color: var(--text-light-color);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-sublist {
  padding-left: 1rem;
}

.nav-sublist .nav-link {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
}

.nav-sublist .nav-link.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 1.5rem;
  background-color: var(--primary-color);
  border-radius: 0 2px 2px 0;
}

.sidebar-header {
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.brand {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin: 0;
  text-align: center;
}

.sidebar-footer {
  margin-top: auto;
  padding: 1rem 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: none;
  border: 2px solid #fecaca;
  border-radius: 4px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.1);
}

.logout-btn:hover:not(:disabled) {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);
}

.logout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #fef2f2;
}

.logout-btn i {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.logout-btn:hover i {
  transform: translateX(2px);
}
</style>
