<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Manage Users</h1>
        <div class="header-actions">
          <div class="search-box">
            <i class="ri-search-line"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search users..."
              @keyup.enter="handleSearch"
              :disabled="userStore.loading"
            />
            <button 
              v-if="searchQuery" 
              @click="clearSearch" 
              class="clear-search"
              :disabled="userStore.loading"
            >
              <i class="ri-close-line"></i>
            </button>
          </div>
          <RouterLink to="/admin/add-user" class="add-button">
            <i class="ri-add-line"></i>
            Add User
          </RouterLink>
        </div>
      </div>
    </header>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Cart</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in userStore.users" :key="user.userID">
            <td>{{ currentPage * itemsPerPage + index + 1 }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['role-badge', user.role]">{{ user.role }}</span>
            </td>
            <td>
              <RouterLink :to="`/admin/manage-cart?user=${user.userID}`">
                View Cart
              </RouterLink>
            </td>
            <td>
              <RouterLink :to="`/admin/manage-order?user=${user.userID}`">
                View Orders
              </RouterLink>
            </td>
            <td>
              <div class="action-buttons">
                <RouterLink 
                  :to="`/admin/edit-user/${user.userID}`"
                  class="edit-btn"
                >
                  <i class="ri-edit-line"></i>
                </RouterLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" v-if="!searchQuery">
      <button 
        class="page-btn"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage <= 0 || userStore.loading"
      >
        <i class="ri-arrow-left-s-line"></i>
      </button>
      
      <button 
        v-for="page in displayedPages"
        :key="page"
        @click="changePage(page)"
        :class="['page-btn', { active: currentPage === page }]"
        :disabled="userStore.loading"
      >
        {{ page + 1 }}
      </button>
      
      <button 
        class="page-btn"
        @click="changePage(currentPage + 1)"
        :disabled="!userStore.hasNextPage || userStore.loading"
      >
        <i class="ri-arrow-right-s-line"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const app = getCurrentInstance();
const router = useRouter();
const userStore = useUserStore();

const currentPage = ref(0);
const itemsPerPage = 10;
const searchQuery = ref("");

const displayedPages = computed(() => {
  const pages = [];
  const start = Math.max(0, currentPage.value - 1);
  // Show 3 pages at a time
  const end = start + 2;
  
  for (let i = start; i <= end; i++) {
    // Only add the page if we're on it or there might be more pages
    if (i <= currentPage.value || userStore.hasNextPage) {
      pages.push(i);
    }
  }
  return pages;
});

async function handleSearch() {
  if (searchQuery.value.length > 0) {
    currentPage.value = 0;
    const result = await userStore.searchUsers(searchQuery.value);
    if (!result.success) {
      app?.proxy.$notify(result.message, "error");
    }
  } else {
    await clearSearch();
  }
}

async function clearSearch() {
  searchQuery.value = "";
  userStore.clearSearch();
  currentPage.value = 0;
  const result = await userStore.fetchUsers(0, itemsPerPage);
  if (!result.success) {
    app?.proxy.$notify(result.message, "error");
  }
}

async function changePage(newPage) {
  if (newPage < 0 || (newPage > currentPage.value && !userStore.hasNextPage)) return;
  
  currentPage.value = newPage;
  const result = await userStore.fetchUsers(newPage, itemsPerPage);
  if (!result.success) {
    app?.proxy.$notify(result.message, "error");
  }
}

onMounted(async () => {
  const result = await userStore.fetchUsers(0, itemsPerPage);
  if (!result.success) {
    app?.proxy.$notify(result.message, "error");
  }
});
</script>

<style scoped>
.admin-page {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.search-box input {
  border: none;
  outline: none;
  width: 200px;
  padding-right: 24px; /* Space for clear button */
}

.search-box input:disabled {
  background: transparent;
  cursor: not-allowed;
}

.clear-search {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--light-text-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search:hover:not(:disabled) {
  color: var(--secondary-dark-color);
}

.clear-search:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.add-button:hover {
  background: var(--secondary-color);
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background: var(--light-bg-color);
  font-weight: 600;
}

.role-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.role-badge.admin {
  background: var(--primary-color);
  color: white;
}

.role-badge.client {
  background: var(--secondary-color);
  color: white;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: var(--secondary-color);
  background: rgba(121, 74, 250, 0.1);
}

.edit-btn:hover {
  background: rgba(121, 74, 250, 0.2);
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: var(--light-bg-color);
  border-color: var(--primary-color);
}

.page-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
}
</style>
