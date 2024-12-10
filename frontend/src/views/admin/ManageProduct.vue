<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Manage Products</h1>
        </div>
        <div class="header-actions">
          <div class="filter-group">
            <div class="search-box">
              <i class="ri-search-line"></i>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search products..."
                @keyup.enter="handleSearch"
                :disabled="productStore.loading"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="clear-search"
                :disabled="productStore.loading"
              >
                <i class="ri-close-line"></i>
              </button>
            </div>

            <select
              v-model="filterCategory"
              class="filter-select"
              @change="handleFiltersChange"
            >
              <option value="">All Categories</option>
              <option
                v-for="category in productStore.categories"
                :key="category.categoryID"
                :value="category.categoryID"
              >
                {{ category.name }}
              </option>
            </select>

            <select
              v-model="filterPromotion"
              class="filter-select"
              @change="handleFiltersChange"
            >
              <option value="">All Promotions</option>
              <option
                v-for="promotion in productStore.promotions"
                :key="promotion.promotionID"
                :value="promotion.promotionID"
              >
                {{ promotion.name }}
              </option>
            </select>
          </div>

          <RouterLink to="/admin/add-product" class="add-button">
            <i class="ri-add-line"></i> Add Product
          </RouterLink>
        </div>
      </div>
    </header>

    <div class="product-list">
      <div v-if="productStore.loading" class="loading-state">
        <i class="ri-loader-4-line spinning"></i> Loading products...
      </div>
      <div v-else-if="productStore.error" class="error-state">
        <i class="ri-error-warning-line"></i> {{ productStore.error }}
      </div>
      <div v-else-if="products.length === 0" class="empty-state">
        <i class="ri-inbox-line"></i>
        <p>No products found</p>
      </div>
      <div v-else class="product-grid">
        <div
          v-for="product in products"
          :key="product.productID"
          class="product-card"
        >
          <div class="product-status" v-if="product.promotionName">
            <span class="discount-badge">-{{ product.discount }}%</span>
          </div>

          <div class="product-image">
            <img :src="getImageUrl(product.image)" :alt="product.name" />
          </div>

          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <div class="category">
              <i class="ri-price-tag-3-line"></i>
              {{ product.categoryName }}
            </div>
            <p class="description">{{ product.description }}</p>

            <div class="stock-info">
              <div class="stock-item">
                <i class="ri-store-line"></i>
                <span
                  >In Stock:
                  {{ formatNumber(product.totalQuantityInStock) }}</span
                >
              </div>
              <div class="stock-item">
                <i class="ri-shopping-cart-line"></i>
                <span
                  >In Cart:
                  {{ formatNumber(product.totalQuantityInCart) }}</span
                >
              </div>
            </div>

            <div class="promotion-info" v-if="product.promotionName">
              <div class="promotion-name">
                <i class="ri-gift-line"></i>
                {{ product.promotionName }}
                <span
                  :class="['status-badge', getPromotionStatusClass(product)]"
                >
                  {{ getPromotionStatus(product) }}
                </span>
              </div>
              <div class="promotion-dates">
                {{ formatDate(product.startDate) }} -
                {{ formatDate(product.endDate) }}
              </div>
            </div>
          </div>

          <div class="product-actions">
            <RouterLink
              :to="'/admin/edit-product/' + product.productID"
              class="edit-btn"
            >
              <i class="ri-edit-line"></i> Edit
            </RouterLink>
            <button
              @click="handleDelete(product.productID)"
              class="delete-btn"
              :disabled="productStore.loading"
            >
              <i class="ri-delete-bin-line"></i> Delete
            </button>
          </div>
        </div>
      </div>

      <div class="pagination">
        <div class="pagination-controls">
          <button
            class="page-btn prev-btn"
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage <= 0 || productStore.loading"
          >
            <i class="ri-arrow-left-s-line"></i>
            Previous
          </button>

          <span class="page-info">Page {{ currentPage + 1 }}</span>

          <button
            class="page-btn next-btn"
            @click="handlePageChange(currentPage + 1)"
            :disabled="!productStore.hasNextPage || productStore.loading"
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
            :disabled="productStore.loading"
          >
            <option :value="12">12</option>
            <option :value="24">24</option>
            <option :value="48">48</option>
            <option :value="96">96</option>
          </select>
          <span>entries</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useProductStore } from "@/stores/product";
import { storeToRefs } from "pinia";
import { APP_CONSTANTS } from "@/utils/constants";

const app = getCurrentInstance();
const productStore = useProductStore();
const { products } = storeToRefs(productStore);

const currentPage = ref(0);
const itemsPerPage = ref(12);
const searchQuery = ref("");
const sortBy = ref("productID");
const sortOrder = ref("asc");
const filterCategory = ref("");
const filterPromotion = ref("");

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
  await loadProducts();
}

async function handleSearch() {
  handleFiltersChange();
}

async function clearSearch() {
  searchQuery.value = "";
  filterCategory.value = "";
  filterPromotion.value = "";
  sortBy.value = "productID";
  sortOrder.value = "asc";
  currentPage.value = 0;
  await loadProducts();
}

async function loadProducts() {
  const result = await productStore.fetchProducts(
    currentPage.value,
    itemsPerPage.value,
    {
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      searchText: searchQuery.value,
      filterCategory: filterCategory.value,
      filterPromotion: filterPromotion.value,
    }
  );

  if (!result.success) {
    app?.proxy.$notify(result.message, "error");
  }
}

async function handlePageChange(newPage) {
  currentPage.value = newPage;
  await loadProducts();
}

async function handlePageSizeChange() {
  currentPage.value = 0;
  await loadProducts();
}

function getImageUrl(linkImage) {
  if (!linkImage) return APP_CONSTANTS.UPLOAD.DEFAULT_IMAGE;
  return /^https?:\/\//i.test(linkImage)
    ? linkImage
    : `${APP_CONSTANTS.UPLOAD.UPLOAD_URL}${linkImage}`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function formatNumber(num) {
  return num || 0;
}
async function handleDelete(productId) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  const result = await productStore.deleteProduct(productId);
  if (result.success) {
    app?.proxy.$notify(result.message, "success");
    // Reload the current page
    await loadProducts();
  } else {
    app?.proxy.$notify(result.message, "error");
  }
}

function getPromotionStatus(product) {
  const now = new Date();
  const startDate = new Date(product.startDate);
  const endDate = new Date(product.endDate);

  if (now < startDate) {
    return "Coming Soon";
  } else if (now > endDate) {
    return "Expired";
  } else {
    return "Active";
  }
}

function getPromotionStatusClass(product) {
  const status = getPromotionStatus(product);
  return {
    "status-expired": status === "Expired",
    "status-active": status === "Active",
    "status-coming": status === "Coming Soon",
  };
}

onMounted(async () => {
  // Load categories and promotions for filters
  await productStore.fetchExtraInfo();
  // Load initial products
  await loadProducts();
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

.header-title h1 {
  font-size: 1.5rem;
  color: var(--secondary-dark-color);
  margin: 0;
}

.primary-btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.primary-btn:hover {
  background: var(--secondary-color);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.product-card {
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.product-status {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}

.discount-badge {
  background: var(--primary-color);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
}

.category {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--secondary-color);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stock-info {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.stock-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
}

.promotion-info {
  background: var(--light-bg-color);
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 0.5rem;
}

.promotion-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
}

.promotion-dates {
  font-size: 0.85rem;
  color: var(--text-light-color);
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.product-info h3 {
  margin: 0 0 0.5rem;
  color: var(--secondary-dark-color);
}

.price {
  font-weight: bold;
  color: var(--primary-color);
  margin: 0.5rem 0;
}

.description {
  color: var(--text-color);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
}

.product-actions {
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.edit-btn {
  background: var(--secondary-color);
  color: white;
  border: none;
  flex: 1;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
}

.edit-btn:hover {
  background: var(--primary-color);
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
  transform: translateY(-1px);
}

.edit-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(66, 185, 131, 0.2);
}

.delete-btn {
  background: white;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  flex: 1;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
}

.delete-btn:hover:not(:disabled) {
  background: #ff3b3b;
  color: white;
  border-color: #ff3b3b;
  box-shadow: 0 2px 8px rgba(255, 59, 59, 0.3);
  transform: translateY(-1px);
}

.delete-btn:active:not(:disabled) {
  background: #e53535;
  border-color: #e53535;
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(229, 53, 53, 0.2);
}

.delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f8f9fa;
  border-color: #dee2e6;
  color: #6c757d;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 3rem;
  font-size: 1.1rem;
}

.empty-state {
  flex-direction: column;
  color: var(--text-light-color);
}

.empty-state i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.error-state {
  color: var(--danger-color);
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

@media (max-width: 768px) {
  .pagination {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .pagination-controls {
    justify-content: center;
  }

  .page-size-selector {
    justify-content: center;
  }
}

/* Animation for loading spinner */
.spinning {
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

/* Updated button styles */
.edit-btn,
.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
}

.primary-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group {
  display: flex;
  gap: 1rem;
  align-items: center;
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
  padding-right: 24px;
}

.clear-search {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--text-light-color);
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  outline: none;
  cursor: pointer;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-light-color);
  font-size: 0.875rem;
}

/* Update the add-button styles */
.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  height: 38px; /* Match height of filter elements */
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.add-button:hover {
  background: var(--secondary-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
}

/* Update filter group styles */
.filter-group {
  display: flex;
  gap: 1rem;
  align-items: center;
  height: 38px; /* Consistent height */
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  height: 38px; /* Consistent height */
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.filter-select {
  height: 38px; /* Consistent height */
  padding: 0 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  outline: none;
  cursor: pointer;
  min-width: 120px; /* Minimum width for better appearance */
}

/* Update header actions to align items */
.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Add responsive styles */
@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .filter-group {
    flex-wrap: wrap;
  }

  .search-box {
    flex: 1;
    min-width: 200px;
  }

  .filter-select {
    flex: 1;
  }

  .add-button {
    justify-content: center;
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
}

.status-expired {
  color: #dc3545;
  background-color: rgba(220, 53, 69, 0.1);
}

.status-active {
  color: #198754;
  background-color: rgba(25, 135, 84, 0.1);
}

.status-coming {
  color: #0d6efd;
  background-color: rgba(13, 110, 253, 0.1);
}

.promotion-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
}

.form-row.three-columns {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>
