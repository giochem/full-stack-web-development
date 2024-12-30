<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <h1>
          {{
            userID
              ? $t("Views.Admin.ManageOrders.OrdersForUser", { id: userID })
              : $t("Views.Admin.ManageOrders.Title")
          }}
        </h1>
        <div class="header-actions">
          <div class="search-box">
            <i class="ri-search-line"></i>
            <input
              type="text"
              v-model="searchText"
              :placeholder="$t('Views.Admin.ManageOrders.SearchPlaceholder')"
              @input="handleSearch"
            />
          </div>
          <select
            v-model="filterStatus"
            class="status-filter"
            @change="handleFilterChange"
          >
            <option value="">
              {{ $t("Views.Admin.ManageOrders.AllStatus") }}
            </option>
            <option value="pending">
              {{ $t("Views.Admin.ManageOrders.Pending") }}
            </option>
            <option value="processing">
              {{ $t("Views.Admin.ManageOrders.Processing") }}
            </option>
            <option value="completed">
              {{ $t("Views.Admin.ManageOrders.Completed") }}
            </option>
            <option value="cancelled">
              {{ $t("Views.Admin.ManageOrders.Cancelled") }}
            </option>
          </select>
        </div>
      </div>
    </header>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th
              class="sortable"
              @click="handleSort('userID')"
              :class="{ active: sortBy === 'userID' }"
            >
              User ID {{ getSortIcon("userID") }}
            </th>
            <th
              class="sortable"
              @click="handleSort('orderID')"
              :class="{ active: sortBy === 'orderID' }"
            >
              Order ID {{ getSortIcon("orderID") }}
            </th>
            <th>Contact</th>
            <th>Address</th>
            <th>Note</th>
            <th
              class="sortable"
              @click="handleSort('totalAmount')"
              :class="{ active: sortBy === 'totalAmount' }"
            >
              Total Amount {{ getSortIcon("totalAmount") }}
            </th>
            <th
              class="sortable"
              @click="handleSort('status')"
              :class="{ active: sortBy === 'status' }"
            >
              Status {{ getSortIcon("status") }}
            </th>
            <th
              class="sortable"
              @click="handleSort('createdAt')"
              :class="{ active: sortBy === 'createdAt' }"
            >
              Created At {{ getSortIcon("createdAt") }}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.orderID">
            <td>{{ order.userID }}</td>
            <td>#{{ order.orderID }}</td>
            <td>{{ order.phone }}</td>
            <td>{{ order.address }}</td>
            <td>{{ order.note || "-" }}</td>
            <td>{{ formatPrice(order.totalAmount) }} đ</td>
            <td>
              <span :class="['status-badge', order.status]">
                {{ order.status }}
              </span>
            </td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <div class="action-buttons">
                <RouterLink
                  :to="`/admin/edit-order/${order.orderID}`"
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

    <div class="pagination">
      <div class="pagination-info">
        <div class="items-per-page">
          <span>{{ $t("Views.Admin.ManageOrders.ShowEntries") }}</span>
          <select v-model="itemsPerPage" @change="handlePageSizeChange">
            <option
              v-for="size in [20, 50, 100, 200]"
              :key="size"
              :value="size"
            >
              {{ size }}
            </option>
          </select>
          <span>{{ $t("Views.Admin.ManageOrders.Items") }}</span>
        </div>
        <div class="items-info">
          {{ $t("Views.Admin.ManageOrders.Showing") }}
          {{ paginationInfo.from }}-{{ paginationInfo.to }}
          {{ $t("Views.Admin.ManageOrders.Of") }} {{ totalItems }}
          {{ $t("Views.Admin.ManageOrders.Items") }}
        </div>
      </div>
      <div class="pagination-buttons">
        <button
          class="page-btn"
          :disabled="currentPage === 0"
          @click="changePage(currentPage - 1)"
        >
          Previous
        </button>

        <div class="page-numbers">
          <button
            v-for="page in displayedPages"
            :key="page"
            :class="['page-number', { active: currentPage === page }]"
            @click="changePage(page)"
          >
            {{ page + 1 }}
          </button>
        </div>

        <button
          class="page-btn"
          :disabled="currentPage >= totalPages - 1"
          @click="changePage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import axios from "@/utils/axios";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const orders = ref([]);
const currentPage = ref(0);
const loading = ref(false);
const itemsPerPage = ref(20);
const totalItems = ref(0);
const searchText = ref("");
const sortBy = ref("userID");
const sortOrder = ref("asc");
const filterStatus = ref("");

const userID = computed(() => {
  const id = route.query.user;
  return id ? parseInt(id) : null;
});

const startIndex = computed(() => currentPage.value * itemsPerPage.value);
const endIndex = computed(() =>
  Math.min((currentPage.value + 1) * itemsPerPage.value, totalItems.value)
);
const hasMoreItems = computed(() => {
  return orders.value.length < totalItems.value;
});

const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value)
);

const paginationInfo = computed(() => {
  const from =
    totalItems.value === 0 ? 0 : currentPage.value * itemsPerPage.value + 1;
  const to = Math.min(
    (currentPage.value + 1) * itemsPerPage.value,
    totalItems.value
  );
  return { from, to };
});

const displayedPages = computed(() => {
  const pages = [];
  const totalPagesValue = totalPages.value;
  const current = currentPage.value;

  if (totalPagesValue <= 5) {
    for (let i = 0; i < totalPagesValue; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 2) {
      for (let i = 0; i < 5; i++) {
        pages.push(i);
      }
    } else if (current >= totalPagesValue - 3) {
      for (let i = totalPagesValue - 5; i < totalPagesValue; i++) {
        pages.push(i);
      }
    } else {
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i);
      }
    }
  }
  return pages;
});

function formatPrice(price) {
  return price?.toLocaleString("vi-VN") || 0;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("vi-VN");
}

function getSortIcon(field) {
  if (sortBy.value !== field) return "";
  return sortOrder.value === "asc" ? "↑" : "↓";
}

let searchTimeout;
function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    fetchOrders();
  }, 300);
}

function handleSort(field) {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortOrder.value = "asc";
  }
  currentPage.value = 0;
  fetchOrders();
}

function handleFilterChange() {
  currentPage.value = 0;
  fetchOrders();
}

async function changePage(newPage) {
  if (newPage < 0) return;
  currentPage.value = newPage;
  await fetchOrders();
}

async function fetchOrders(isLoadMore = false) {
  try {
    loading.value = true;
    const params = new URLSearchParams({
      page: currentPage.value,
      size: itemsPerPage.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
    });

    if (searchText.value) {
      params.append("searchText", searchText.value);
    }

    if (filterStatus.value) {
      params.append("filterStatus", filterStatus.value);
    }

    if (userID.value) {
      params.append("userID", userID.value);
    }

    const response = await axios.get(`/orders?${params}`, {
      withCredentials: true
    });

    if (isLoadMore) {
      orders.value = [...orders.value, ...response.data.data];
    } else {
      orders.value = response.data.data;
    }

    totalItems.value = response.data.total;
  } catch (error) {
    console.error("Error fetching orders:", error);
  } finally {
    loading.value = false;
  }
}

async function loadMore() {
  currentPage.value++;
  await fetchOrders(true);
}

function handlePageSizeChange() {
  currentPage.value = 0;
  fetchOrders();
}

onMounted(() => {
  fetchOrders();
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

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.processing {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-btn {
  color: var(--secondary-color);
  background: rgba(121, 74, 250, 0.1);
}

.delete-btn {
  color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
}

.edit-btn:hover {
  background: rgba(121, 74, 250, 0.2);
}

.delete-btn:hover {
  background: rgba(220, 53, 69, 0.2);
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 2rem;
  color: var(--light-text-color);
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.items-per-page select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  color: var(--secondary-dark-color);
  cursor: pointer;
}

.items-per-page select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.pagination-controls {
  display: flex;
  gap: 0.5rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-color);
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-filter {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  color: var(--secondary-dark-color);
  cursor: pointer;
}

.status-filter:focus {
  outline: none;
  border-color: var(--primary-color);
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  color: var(--primary-color);
}

.sortable.active {
  color: var(--primary-color);
}

.load-more-btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.load-more-btn:hover:not(:disabled) {
  background: var(--secondary-color);
}

.load-more-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-number {
  min-width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-number:hover:not(.active) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-number.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.items-info {
  color: var(--text-light-color);
}
</style>
