<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Manage Products</h1>
        </div>
        <div class="header-actions">
          <RouterLink to="/admin/add-product" class="primary-btn">
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
                <span>In Stock: {{ product.totalQuantityInStock }}</span>
              </div>
              <div class="stock-item">
                <i class="ri-shopping-cart-line"></i>
                <span>In Cart: {{ product.totalQuantityInCart }}</span>
              </div>
            </div>

            <div class="promotion-info" v-if="product.promotionName">
              <div class="promotion-name">
                <i class="ri-gift-line"></i>
                {{ product.promotionName }}
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

      <div class="pagination" v-if="products.length > 0">
        <button
          class="pagination-btn"
          :disabled="currentPage === 0 || productStore.loading"
          @click="handlePageChange(currentPage - 1)"
        >
          <i class="ri-arrow-left-s-line"></i> Previous
        </button>
        <span class="page-info">Page {{ currentPage + 1 }}</span>
        <button
          class="pagination-btn"
          :disabled="!productStore.hasNextPage || productStore.loading"
          @click="handlePageChange(currentPage + 1)"
        >
          Next <i class="ri-arrow-right-s-line"></i>
        </button>
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
const PAGE_SIZE = 12;

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function loadProducts(page = 0) {
  const result = await productStore.fetchProducts(page, PAGE_SIZE);
  if (!result.success) {
    app?.proxy.$notify(result.message, "error");
  }
}

async function handleDelete(productId) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  const result = await productStore.deleteProduct(productId);
  if (result.success) {
    app?.proxy.$notify(result.message, "success");
    // Reload the current page
    await loadProducts(currentPage.value);
  } else {
    app?.proxy.$notify(result.message, "error");
  }
}

async function handlePageChange(newPage) {
  currentPage.value = newPage;
  await loadProducts(newPage);
}

function getImageUrl(linkImage) {
  console.log(linkImage);
  if (!linkImage) return "";
  return /^https?:\/\//i.test(linkImage)
    ? linkImage
    : `${APP_CONSTANTS.UPLOAD.UPLOAD_URL}${linkImage}`;
}
onMounted(async () => {
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
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--light-bg-color);
}

.pagination-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.page-info {
  color: var(--text-color);
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
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
</style>
