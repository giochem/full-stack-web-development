<template>
  <div class="admin-page">
    <ManageUserHeader
      :searchQuery="searchQuery"
      :loading="loading"
      :filterRole="filterRole"
      @update:searchQuery="searchQuery = $event"
      @update:filterRole="filterRole = $event"
      @handleSearch="handleSearch"
      @clearSearch="clearSearch"
      @handleFiltersChange="handleFiltersChange"
    />
    <ManageUserTable
      :users="users"
      :currentPage="currentPage"
      :itemsPerPage="itemsPerPage"
      :sortBy="sortBy"
      :sortOrder="sortOrder"
      @toggleSort="toggleSort"
      @changePage="changePage"
    />
    <ManageUserPagination
      :currentPage="currentPage"
      :itemsPerPage="itemsPerPage"
      :hasNextPage="hasNextPage"
      :loading="loading"
      @changePage="changePage"
      @update:itemsPerPage="itemsPerPage = $event"
      @handlePageSizeChange="handlePageSizeChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import axios from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/constants";
import ManageUserHeader from "@/components/admin/ManageUserHeader.vue";
import ManageUserTable from "@/components/admin/ManageUserTable.vue";
import ManageUserPagination from "@/components/admin/ManageUserPagination.vue";

const app = getCurrentInstance();
const router = useRouter();

const currentPage = ref(0);
const itemsPerPage = ref(10);
const searchQuery = ref("");
const sortBy = ref("userID");
const sortOrder = ref("asc");
const filterRole = ref("");
const users = ref([]);
const loading = ref(false);
const hasNextPage = ref(true);

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

async function fetchUsers(page = 0, size = 10, filters = {}) {
  loading.value = true;
  try {
    const params = {
      page,
      size,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      ...(filters.filterRole && { filterRole: filters.filterRole }),
      ...(filters.searchText && { searchText: filters.searchText })
    };
    const response = await axios({
      method: API_ENDPOINTS.USERS.LIST.method,
      url: API_ENDPOINTS.USERS.LIST.url,
      params
    });
    users.value = response.data.data;
    hasNextPage.value = users.value.length >= size;
    return { success: true };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, message: error.message };
  } finally {
    loading.value = false;
  }
}

async function handleFiltersChange() {
  currentPage.value = 0;
  const result = await fetchUsers(0, itemsPerPage.value, {
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    filterRole: filterRole.value,
    searchText: searchQuery.value
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
  currentPage.value = 0;
  const result = await fetchUsers(0, itemsPerPage.value);
  if (!result.success) {
    app?.proxy.$notify(result.message, "error");
  }
}

async function changePage(newPage) {
  if (newPage < 0 || (newPage > currentPage.value && !hasNextPage.value))
    return;

  currentPage.value = newPage;
  const result = await fetchUsers(newPage, itemsPerPage.value, {
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    filterRole: filterRole.value,
    searchText: searchQuery.value
  });

  if (!result.success) {
    app?.proxy.$notify(result.message, "error");
  }
}

async function handlePageSizeChange() {
  currentPage.value = 0;
  const result = await fetchUsers(0, itemsPerPage.value, {
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    filterRole: filterRole.value,
    searchText: searchQuery.value
  });

  if (!result.success) {
    app?.proxy.$notify(result.message, "error");
  }
}

onMounted(async () => {
  const result = await fetchUsers(0, itemsPerPage.value, {
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    filterRole: filterRole.value,
    searchText: searchQuery.value
  });
  if (!result.success) {
    app?.proxy.$notify(result.message, "error");
  }
});
</script>

<style>
.admin-page {
  padding: 1.5rem;
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

/* Add created at column styles */
.data-table td.created-at {
  white-space: nowrap;
  color: var(--light-text-color);
  font-size: 0.875rem;
}
</style>
