<template>
  <div class="category">
    <div class="container">
      <div class="breadcrumb">Category</div>
      <div class="content">
        <div class="left">
          <h3>Filter</h3>
          <div v-show="categories.length > 0">
            <label for="category">Category</label>
            <br />
            <select v-model="filters.filterCategory" name="category">
              <option value="">All</option>
              <option
                v-for="category in categories"
                :key="category.categoryID"
                :value="category.categoryID"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          <div v-show="promotions.length > 0">
            <label for="promotion">Promotion</label>
            <br />
            <select v-model="filters.filterPromotion" name="promotion">
              <option value="">All</option>
              <option
                v-for="promotion in promotions"
                :key="promotion.promotionID"
                :value="promotion.promotionID"
              >
                {{ promotion.name }}
              </option>
            </select>
          </div>
          <br />
          <input type="submit" value="Filter" @click="fetchProducts" />
        </div>
        <div class="right">
          <div v-if="loading" class="loading">
            <p>loading</p>
          </div>
          <div v-else-if="hasError" class="error">
            <p>{{ hasError }}</p>
          </div>
          <div v-else-if="products.length === 0" class="no-products">
            <p>No products</p>
          </div>
          <div e-else class="products-grid">
            <div
              v-for="product in products"
              :key="product.productID"
              class="product-card"
              @click="navigateTo(`/product/${product.productID}`)"
            >
              <div class="product-image">
                <img
                  :src="`${APP_CONSTANTS.UPLOAD.UPLOAD_URL}${product.image}`"
                  :alt="product.name"
                />
                <div
                  v-if="product.discount"
                  class="discount-badge"
                  :class="getDiscountStatus(product)"
                >
                  -{{ product.discount }}%
                </div>
              </div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <div
                  v-if="product.discount"
                  class="discount-period"
                  :class="getDiscountStatus(product)"
                >
                  <i class="ri-time-line"></i>
                  <span>
                    <template v-if="getDiscountStatus(product) === 'active'">
                      Sale ends {{ formatDiscountPeriod(product) }}
                    </template>
                    <template
                      v-else-if="getDiscountStatus(product) === 'upcoming'"
                    >
                      Sale starts {{ formatStartDate(product) }}
                    </template>
                    <template v-else>
                      Sale ended {{ formatDiscountPeriod(product) }}
                    </template>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { APP_CONSTANTS } from "@/utils/constants";
import { onMounted, ref } from "vue";
import axios from "@/utils/axios";
import { useRouter } from "vue-router";
import { API_ENDPOINTS } from "@/utils/constants";
import { parseISO, isAfter, isBefore, formatDistanceToNow } from "date-fns";
const router = useRouter();

const loading = ref(false);
const hasError = ref(null);
const products = ref([]);
const categories = ref([]);
const promotions = ref([]);
const page = ref(0);
const size = ref(12);
const filters = ref({
  sortBy: "productID",
  sortOrder: "asc",
  searchText: "",
  filterCategory: "",
  filterPromotion: ""
});
onMounted(async () => {
  await fetchProducts();
  await fetchCategories();
  await fetchPromotions();
});
async function fetchProducts() {
  loading.value = true;
  try {
    const response = await axios[
      API_ENDPOINTS.PRODUCTS.LIST.method.toLowerCase()
    ](API_ENDPOINTS.PRODUCTS.LIST.url(page.value, size.value, filters.value));
    products.value = response.data.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    hasError.value = errorMessage;
  } finally {
    loading.value = false;
  }
}
async function fetchCategories() {
  const response = await axios[
    API_ENDPOINTS.CATEGORIES.LIST.method.toLowerCase()
  ](API_ENDPOINTS.CATEGORIES.LIST.url);
  categories.value = response.data.data;
}
async function fetchPromotions() {
  const response = await axios[
    API_ENDPOINTS.PROMOTIONS.LIST.method.toLowerCase()
  ](API_ENDPOINTS.PROMOTIONS.LIST.url);
  promotions.value = response.data.data;
}
function navigateTo(path) {
  router.push(path);
}
function getDiscountStatus(product) {
  if (!product.startDate || !product.endDate || !product.discount)
    return "none";

  const now = new Date();
  const startDate = parseISO(product.startDate);
  const endDate = parseISO(product.endDate);

  if (isBefore(now, startDate)) return "upcoming";
  if (isAfter(now, endDate)) return "expired";
  return "active";
}
function formatStartDate(product) {
  if (!product.startDate) return "";
  const startDate = parseISO(product.startDate);
  return formatDistanceToNow(startDate, { addSuffix: true });
}

function formatDiscountPeriod(product) {
  if (!product.endDate) return "";
  const endDate = parseISO(product.endDate);
  return formatDistanceToNow(endDate, { addSuffix: true });
}
function getErrorMessage(error) {
  // Check for validation errors array
  if (
    error.response?.data?.errors &&
    Array.isArray(error.response.data.errors)
  ) {
    // Join all error messages with newlines
    return error.response.data.errors.map((err) => err.msg).join("\n");
  }
  // Fallback to standard error message
  return error.response?.data?.message || error.message;
}
</script>
<style scoped>
.category {
  width: 100%;
  height: 100%;
}
.container {
  min-height: 100vh;
  padding: 2rem;
}
.content {
  display: flex;
  gap: 2rem;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(300px, 1fr));
  gap: 2rem;
}
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  position: relative;
  padding-top: 100%;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
  z-index: 1;
  color: white;
}

.discount-badge.active {
  background-color: var(--primary-color);
}

.discount-badge.upcoming {
  background-color: #f59e0b; /* Amber color for upcoming */
}

.discount-badge.expired {
  background-color: var(--light-text-color); /* Grey for expired */
}
.discount-period {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85em;
  margin-top: 8px;
}

.discount-period.active {
  color: var(--primary-color);
}

.discount-period.upcoming {
  color: #f59e0b;
}

.discount-period.expired {
  color: var(--light-text-color);
}

.discount-period i {
  font-size: 1.1em;
}
</style>
