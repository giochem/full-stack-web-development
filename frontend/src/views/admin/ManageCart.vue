<template>
  <div class="manage-cart">
    <div class="header">
      <h2>
        {{
          userID
            ? $t("Views.Admin.ManageCarts.CartsForUser", { id: userID })
            : $t("Views.Admin.ManageCarts.Title")
        }}
      </h2>
      <div class="search-box">
        <i class="ri-search-line"></i>
        <input
          type="text"
          v-model="searchText"
          :placeholder="$t('Views.Admin.ManageCarts.SearchPlaceholder')"
          @input="handleSearch"
        />
      </div>
    </div>

    <div v-if="cartStore.loading" class="loading">
      <i class="ri-loader-4-line spin"></i>
      {{ $t("Views.Admin.ManageCarts.Loading") }}
    </div>

    <div v-else-if="cartStore.error" class="error">
      {{ cartStore.error }}
    </div>

    <div v-else-if="!cartStore.carts.length" class="empty-state">
      <i class="ri-shopping-cart-line"></i>
      <p>No cart items found</p>
    </div>

    <div v-else>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th
                class="sortable"
                :class="{ active: sortBy === 'userID' }"
                @click="handleSort('userID')"
              >
                User ID {{ getSortIndicator("userID") }}
              </th>
              <th>Product</th>
              <th>SKU</th>
              <th
                class="sortable"
                :class="{ active: sortBy === 'quantity' }"
                @click="handleSort('quantity')"
              >
                Quantity {{ getSortIndicator("quantity") }}
              </th>
              <th
                class="sortable"
                :class="{ active: sortBy === 'price' }"
                @click="handleSort('price')"
              >
                Price {{ getSortIndicator("price") }}
              </th>
              <th
                class="sortable"
                :class="{ active: sortBy === 'discount' }"
                @click="handleSort('discount')"
              >
                Discount {{ getSortIndicator("discount") }}
              </th>
              <th>Final Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cart in cartStore.carts" :key="cart.cartID">
              <td>{{ cart.userID }}</td>
              <td class="product-cell">
                <div class="product-info">
                  <img
                    :src="getImageUrl(cart.image)"
                    :alt="cart.name"
                    class="product-image"
                  />
                  <span>{{ cart.name }}</span>
                </div>
              </td>
              <td>{{ cart.sku }}</td>
              <td>{{ cart.quantity }}</td>
              <td>{{ formatPrice(cart.price) }}</td>
              <td>{{ cart.discount ? `${cart.discount}%` : "-" }}</td>
              <td>
                {{
                  formatPrice(
                    cartStore.calculateFinalPrice(cart.price, cart.discount)
                  )
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <div class="pagination-info">
          <div class="items-per-page">
            <span>{{ $t("Views.Admin.ManageCarts.ShowEntries") }}</span>
            <select v-model="pageSize" @change="handlePageSizeChange">
              <option
                v-for="size in [20, 50, 100, 200]"
                :key="size"
                :value="size"
              >
                {{ size }}
              </option>
            </select>
            <span>{{ $t("Views.Admin.ManageCarts.Items") }}</span>
          </div>
          <div class="items-info">
            {{ $t("Views.Admin.ManageCarts.Showing") }}
            {{ paginationInfo.from }}-{{ paginationInfo.to }}
            {{ $t("Views.Admin.ManageCarts.Of") }} {{ cartStore.totalItems }}
            {{ $t("Views.Admin.ManageCarts.Items") }}
          </div>
        </div>
        <div class="pagination-buttons">
          <button
            class="page-btn"
            :disabled="currentPage === 0"
            @click="changePage(currentPage - 1)"
          >
            {{ $t("Views.Admin.ManageCarts.Previous") }}
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
            :disabled="currentPage >= cartStore.totalPages - 1"
            @click="changePage(currentPage + 1)"
          >
            {{ $t("Views.Admin.ManageCarts.Next") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "@/stores/cart";
import { useRoute } from "vue-router";
import { APP_CONSTANTS } from "@/utils/constants";
const route = useRoute();
const cartStore = useCartStore();
const currentPage = ref(0);
const searchText = ref("");
const pageSize = ref(20);
const sortBy = ref("userID");
const sortOrder = ref("asc");

function getImageUrl(image) {
  if (!image) return APP_CONSTANTS.UPLOAD.DEFAULT_IMAGE;
  return `${APP_CONSTANTS.UPLOAD.UPLOAD_URL}/${image}`;
}
// Get userID from route query if it exists
const userID = computed(() => {
  const id = route.query.user;
  return id ? parseInt(id) : null;
});

// Helper function to get sort indicator
const getSortIndicator = (field) => {
  if (sortBy.value !== field) return "";
  return sortOrder.value === "asc" ? "↑" : "↓";
};

// Computed property for displayed page numbers
const displayedPages = computed(() => {
  const pages = [];
  const totalPages = cartStore.totalPages;
  const current = currentPage.value;

  if (totalPages <= 5) {
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 2) {
      for (let i = 0; i < 5; i++) {
        pages.push(i);
      }
    } else if (current >= totalPages - 3) {
      for (let i = totalPages - 5; i < totalPages; i++) {
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

// Computed property for pagination info
const paginationInfo = computed(() => {
  const from =
    cartStore.totalItems === 0 ? 0 : currentPage.value * pageSize.value + 1;
  const to = Math.min(
    (currentPage.value + 1) * pageSize.value,
    cartStore.totalItems
  );
  return { from, to };
});

// Debounce function for search
let searchTimeout;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    fetchCarts();
  }, 300);
};

const handleSort = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortOrder.value = "asc";
  }
  currentPage.value = 0;
  fetchCarts();
};

const changePage = (page) => {
  currentPage.value = page;
  fetchCarts();
};

const handlePageSizeChange = () => {
  currentPage.value = 0;
  fetchCarts();
};

const fetchCarts = () => {
  cartStore.fetchCarts({
    page: currentPage.value,
    size: pageSize.value,
    searchText: searchText.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    userID: userID.value
  });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

onMounted(() => {
  fetchCarts();
});
</script>

<style scoped>
.manage-cart {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  margin: 0;
  color: var(--secondary-dark-color);
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
  font-size: 0.95rem;
}

.search-box i {
  color: var(--text-light-color);
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  overflow-x: auto;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-light-color);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background-color: var(--background-color);
  font-weight: 600;
  color: var(--secondary-dark-color);
}

.sortable {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.sortable:hover {
  color: var(--primary-color);
}

.sortable.active {
  color: var(--primary-color);
}

.product-cell {
  min-width: 200px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--text-light-color);
}

.error {
  color: var(--danger-color);
  padding: 1rem;
  text-align: center;
  background: var(--danger-light-color);
  border-radius: 4px;
  margin: 1rem 0;
}

/* Pagination styles */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 2rem;
  color: var(--text-light-color);
  font-size: 0.95rem;
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
  font-size: 0.95rem;
  color: var(--text-color);
  cursor: pointer;
}

.items-per-page select:focus {
  border-color: var(--primary-color);
  outline: none;
}

.pagination-buttons {
  display: flex;
  align-items: center;
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

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

td:nth-child(5),
td:nth-child(7) {
  text-align: right;
  font-family: monospace;
}
</style>
