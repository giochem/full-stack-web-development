<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Manage Users</h1>
        <div class="header-actions">
          <div class="filter-group">
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

            <select
              v-model="filterRole"
              class="filter-select"
              @change="handleFiltersChange"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
            </select>
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
            <th>
              <div class="th-content">
                ID
                <!-- <i :class="getSortIcon('userID')"></i> -->
              </div>
            </th>
            <th>
              <div class="th-content" @click="toggleSort('username')">
                Username
                <i :class="getSortIcon('username')"></i>
              </div>
            </th>
            <th>
              <div class="th-content" @click="toggleSort('email')">
                Email
                <i :class="getSortIcon('email')"></i>
              </div>
            </th>
            <th>Role</th>
            <th>Cart</th>
            <th>Order</th>
            <th>
              <div class="th-content" @click="toggleSort('createdAt')">
                Created At
                <i :class="getSortIcon('createdAt')"></i>
              </div>
            </th>
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
              <RouterLink
                :to="`/admin/manage-cart?user=${user.userID}`"
                class="stat-link"
              >
                <span class="stat-count">{{ user.numCartItems }}</span>
                <span class="stat-label">items</span>
              </RouterLink>
            </td>
            <td>
              <RouterLink
                :to="`/admin/manage-order?user=${user.userID}`"
                class="stat-link"
              >
                <span class="stat-count">{{ user.numOrders }}</span>
                <span class="stat-label">orders</span>
              </RouterLink>
            </td>
            <td class="created-at">{{ user.createdAt }}</td>
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
      <div class="pagination-controls">
        <button
          class="page-btn prev-btn"
          @click="changePage(currentPage - 1)"
          :disabled="currentPage <= 0 || userStore.loading"
        >
          <i class="ri-arrow-left-s-line"></i>
          Previous
        </button>

        <span class="page-info">Page {{ currentPage + 1 }}</span>

        <button
          class="page-btn next-btn"
          @click="changePage(currentPage + 1)"
          :disabled="!userStore.hasNextPage || userStore.loading"
        >
          Next
          <i class="ri-arrow-right-s-line"></i>
        </button>
      </div>

      <div class="page-size-selector">
        <label>Show:</label>
        <select
          v-model="itemsPerPage"
          @change="handlePageSizeChange"
          :disabled="userStore.loading"
        >
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
        <span>entries</span>
      </div>
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
const itemsPerPage = ref(10);
const searchQuery = ref("");
const sortBy = ref("userID");
const sortOrder = ref("asc");
const filterRole = ref("");

const getSortIcon = (field) => {
  if (sortBy.value !== field) return "ri-more-fill";
  return sortOrder.value === "asc" ? "ri-sort-asc" : "ri-sort-desc";
};

const toggleSort = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortOrder.value = "asc";
  }
  handleFiltersChange();
};

async function handleFiltersChange() {
  currentPage.value = 0;
  const result = await userStore.fetchUsers(0, itemsPerPage.value, {
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    filterRole: filterRole.value,
    searchText: searchQuery.value,
  });

  if (!result.success) {
    app?.proxy.$notify(result.message, "error");
  }
}

async function handleSearch() {
  handleFiltersChange();
}

async function clearSearch() {
  searchQuery.value = "";
  filterRole.value = "";
  sortBy.value = "userID";
  sortOrder.value = "asc";
  userStore.clearSearch();
  currentPage.value = 0;
  const result = await userStore.fetchUsers(0, itemsPerPage.value);
  if (!result.success) {
    app?.proxy.$notify(result.message, "error");
  }
}

async function changePage(newPage) {
  if (newPage < 0 || (newPage > currentPage.value && !userStore.hasNextPage))
    return;

  currentPage.value = newPage;
  const result = await userStore.fetchUsers(newPage, itemsPerPage.value, {
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    filterRole: filterRole.value,
    searchText: searchQuery.value,
  });

  if (!result.success) {
    app?.proxy.$notify(result.message, "error");
  }
}

async function handlePageSizeChange() {
  currentPage.value = 0;
  const result = await userStore.fetchUsers(0, itemsPerPage.value, {
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    filterRole: filterRole.value,
    searchText: searchQuery.value,
  });

  if (!result.success) {
    app?.proxy.$notify(result.message, "error");
  }
}

onMounted(async () => {
  const result = await userStore.fetchUsers(0, itemsPerPage.value);
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
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 0 1rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--light-text-color);
  font-size: 0.875rem;
}

.page-size-selector select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  outline: none;
  cursor: pointer;
}

.page-size-selector select:hover:not(:disabled) {
  border-color: var(--primary-color);
}

.page-size-selector select:disabled {
  cursor: not-allowed;
  opacity: 0.7;
  background: var(--light-bg-color);
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: var(--light-text-color);
}

.stat-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--text-color);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.stat-link:hover {
  background-color: var(--light-bg-color);
}

.stat-count {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--light-text-color);
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
}

.filter-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  outline: none;
  cursor: pointer;
}

.filter-select:hover {
  border-color: var(--primary-color);
}

.th-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.th-content:hover {
  color: var(--primary-color);
}

.th-content i {
  font-size: 1.125rem;
}

/* Update table header styles */
.data-table th {
  background: var(--light-bg-color);
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  white-space: nowrap;
}

/* Add created at column styles */
.data-table td.created-at {
  white-space: nowrap;
  color: var(--light-text-color);
  font-size: 0.875rem;
}
</style>
