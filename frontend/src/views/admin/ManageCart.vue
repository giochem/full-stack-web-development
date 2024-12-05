<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Manage Carts</h1>
        <div class="header-actions">
          <div class="search-box">
            <i class="ri-search-line"></i>
            <input type="text" placeholder="Search carts..." />
          </div>
        </div>
      </div>
    </header>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cart, index) in carts" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ cart.userID }}</td>
            <td>{{ cart.productID }}</td>
            <td>
              <span class="quantity-badge">
                {{ cart.quantity }}
              </span>
            </td>
            <td>{{ formatDate(cart.createAt) }}</td>
            <td>{{ cart.updateAt ? formatDate(cart.updateAt) : '-' }}</td>
            <td>
              <div class="action-buttons">
                <button @click="remove(cart.productID, cart.userID)" class="delete-btn">
                  <i class="ri-delete-bin-line"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button
        class="page-btn"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage <= 0"
      >
        <i class="ri-arrow-left-s-line"></i>
      </button>

      <button
        v-for="page in displayedPages"
        :key="page"
        @click="changePage(page)"
        :class="['page-btn', { active: currentPage === page }]"
      >
        {{ page + 1 }}
      </button>

      <button
        class="page-btn"
        @click="changePage(currentPage + 1)"
        :disabled="!hasMorePages"
      >
        <i class="ri-arrow-right-s-line"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const carts = ref([]);
const currentPage = ref(0);
const itemsPerPage = 10;
const totalPages = ref(1);

const displayedPages = computed(() => {
  const pages = [];
  const start = Math.max(0, currentPage.value - 1);
  const end = Math.min(totalPages.value - 1, start + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const hasMorePages = computed(() => {
  return currentPage.value < totalPages.value - 1;
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function fetchCarts(page = 0) {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/carts?page=${page}&size=${itemsPerPage}`,
      { withCredentials: true }
    );
    carts.value = response.data.data;
    totalPages.value = Math.ceil(response.data.total / itemsPerPage);
  } catch (error) {
    console.error("Error fetching carts:", error);
  }
}

async function changePage(newPage) {
  if (newPage < 0 || newPage >= totalPages.value) return;
  currentPage.value = newPage;
  await fetchCarts(newPage);
}

async function remove(productID, userID) {
  if (!confirm("Are you sure you want to delete this cart item?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/carts/${productID}/${userID}`, {
      withCredentials: true,
    });
    await fetchCarts(currentPage.value);
  } catch (error) {
    console.error("Error deleting cart item:", error);
  }
}

onMounted(() => {
  fetchCarts();
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
  margin-bottom: 2rem;
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

.quantity-badge {
  padding: 0.25rem 0.5rem;
  background: var(--light-bg-color);
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--secondary-dark-color);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.delete-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
}

.delete-btn:hover {
  background: rgba(220, 53, 69, 0.2);
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

.page-btn:hover {
  background: var(--light-bg-color);
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
</style>
