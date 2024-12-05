<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Manage Products</h1>
        </div>
        <div class="header-actions">
          <RouterLink to="/admin/add-product" class="primary-btn">
            Add Product
          </RouterLink>
        </div>
      </div>
    </header>

    <div class="product-list">
      <div v-if="productStore.loading" class="loading-state">
        Loading products...
      </div>
      <div v-else-if="productStore.error" class="error-state">
        {{ productStore.error }}
      </div>
      <div v-else-if="products.length === 0" class="empty-state">
        No products found
      </div>
      <div v-else class="product-grid">
        <div
          v-for="product in products"
          :key="product.productID"
          class="product-card"
        >
          <div class="product-image">
            <img :src="getImageUrl(product.linkImage)" :alt="product.name" />
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="price">${{ product.price }}</p>
            <p class="description">{{ product.description }}</p>
          </div>
          <div class="product-actions">
            <RouterLink
              :to="'/admin/edit-product/' + product.productID"
              class="edit-btn"
            >
              Edit
            </RouterLink>
            <button
              @click="handleDelete(product.productID)"
              class="delete-btn"
              :disabled="productStore.loading"
            >
              Delete
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
          Previous
        </button>
        <span class="page-info">Page {{ currentPage + 1 }}</span>
        <button
          class="pagination-btn"
          :disabled="!productStore.hasNextPage || productStore.loading"
          @click="handlePageChange(currentPage + 1)"
        >
          Next
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
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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
  gap: 0.5rem;
  border-top: 1px solid var(--border-color);
}

.edit-btn,
.delete-btn {
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
}

.edit-btn {
  background: var(--secondary-color);
  color: white;
  border: none;
}

.edit-btn:hover {
  background: var(--primary-color);
}

.delete-btn {
  background: white;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
}

.delete-btn:hover:not(:disabled) {
  background: var(--danger-color);
  color: white;
}

.delete-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-color);
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
</style>
