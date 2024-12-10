<template>
  <div class="home">
    <div class="container">
      <section class="products-section">
        <h2>{{ $t("Views.Client.Title") }}</h2>

        <div v-if="loading" class="loading">
          <p>{{ $t("Views.Client.Loading") }}</p>
        </div>

        <div v-else-if="productStore.error" class="error">
          <p>{{ productStore.error }}</p>
        </div>

        <div v-else-if="productStore.products.length === 0" class="no-products">
          <p>{{ $t("Views.Client.NoProducts") }}</p>
        </div>

        <div v-else class="products-grid">
          <div
            v-for="product in productStore.products"
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
                  <template v-else-if="getDiscountStatus(product) === 'upcoming'">
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
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "@/stores/product";
import { APP_CONSTANTS } from "@/utils/constants";
import { parseISO, isAfter, isBefore, formatDistanceToNow } from "date-fns";

const router = useRouter();
const productStore = useProductStore();

const loading = computed(() => productStore.loading);

onMounted(async () => {
  await productStore.fetchProducts();
});

function navigateTo(path) {
  router.push(path);
}

function getDiscountStatus(product) {
  if (!product.startDate || !product.endDate || !product.discount) return 'none';
  
  const now = new Date();
  const startDate = parseISO(product.startDate);
  const endDate = parseISO(product.endDate);
  
  if (isBefore(now, startDate)) return 'upcoming';
  if (isAfter(now, endDate)) return 'expired';
  return 'active';
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
</script>

<style scoped>
.home {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.products-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--secondary-dark-color);
}

.no-products {
  text-align: center;
  padding: 2rem;
  color: var(--light-text-color);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 1rem;
}

.product-info h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: var(--secondary-dark-color);
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

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: var(--light-text-color);
}

.error {
  color: var(--error-color);
}
</style>
