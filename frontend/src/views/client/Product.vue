<template>
  <div class="product-detail">
    <div class="product-container" v-if="product">
      <div class="product-image">
        <img :src="productImage" :alt="product.name" />
      </div>

      <div class="product-info">
        <h1 class="product-title">{{ product.name }}</h1>
        <div class="product-price">
          <span v-if="product.discount" class="original-price">
            {{ formatPrice(selectedVariant?.price || 0) }} đ
          </span>
          <span :class="{ 'discounted-price': product.discount }">
            {{ formatPrice(calculateFinalPrice(selectedVariant?.price || 0)) }}
            đ
          </span>
          <span v-if="product.discount" class="discount-badge">
            -{{ product.discount }}%
          </span>
          <div
            v-if="product.discount"
            class="discount-period"
            :class="discountStatus"
          >
            <i class="ri-time-line"></i>
            <span>
              <template v-if="discountStatus === 'expired'">
                Sale ended {{ formatDiscountPeriod }}
              </template>
              <template v-else-if="discountStatus === 'active'">
                Sale ends {{ formatDiscountPeriod }}
              </template>
              <template v-else-if="discountStatus === 'upcoming'">
                Sale starts {{ formatStartDate }}
              </template>
            </span>
          </div>
        </div>
        <div class="product-description">{{ product.description }}</div>

        <!-- Dynamic Variation Options -->
        <div
          v-for="(variation, index) in groupedVariations"
          :key="index"
          class="product-options"
        >
          <h3>{{ variation.nameAtribute }}</h3>
          <div class="option-buttons">
            <label
              v-for="option in variation.values"
              :key="option"
              class="checkbox-container"
            >
              <input
                type="checkbox"
                :checked="selectedVariations[variation.nameAtribute] === option"
                @change="selectVariation(variation.nameAtribute, option)"
              />
              <span class="checkbox-label">{{ option }}</span>
            </label>
          </div>
        </div>

        <!-- Stock Information -->
        <div class="stock-info">
          In Stock: {{ selectedVariant?.quantity || 0 }} items
        </div>

        <div class="product-actions">
          <div class="quantity-selector">
            <button
              class="quantity-btn"
              @click="decreaseQuantity"
              :disabled="quantity <= 1"
            >
              <span class="minus">−</span>
            </button>
            <input
              type="number"
              v-model="quantity"
              min="1"
              :max="selectedVariant?.quantity || 0"
              @input="validateQuantity"
              class="quantity-input"
            />
            <button
              class="quantity-btn"
              @click="increaseQuantity"
              :disabled="quantity >= (selectedVariant?.quantity || 0)"
            >
              <span class="plus">+</span>
            </button>
          </div>
          <button
            @click="addToCart"
            class="add-to-cart-btn"
            :disabled="isAddingToCart || !selectedVariant"
          >
            {{ isAddingToCart ? "Adding..." : "Add to Cart" }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="loading">{{ $t("Views.Client.Product.Loading") }}</div>

    <!-- Success Tooltip -->
    <div v-if="showTooltip" class="tooltip" :class="{ show: showTooltip }">
      <div class="tooltip-content">
        <i class="ri-check-line"></i>
        <span>{{ $t("Views.Client.Product.AddedToCart") }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance, watch } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "@/stores/product";
import { useCartStore } from "@/stores/cart";
import { APP_CONSTANTS } from "@/utils/constants";
import { formatDistanceToNow, parseISO, isAfter, isBefore } from "date-fns";

const app = getCurrentInstance();
const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

const quantity = ref(1);
const showTooltip = ref(false);
const isAddingToCart = ref(false);
const selectedVariations = ref({});

// Computed properties
const product = computed(() => productStore.currentProduct?.[0]);
const productItems = computed(() => productStore.currentProduct?.[1] || []);

const productImage = computed(() => {
  if (!product.value?.image) return "https://via.placeholder.com/400";
  return `${APP_CONSTANTS.UPLOAD.UPLOAD_URL}${product.value.image}`;
});

// Group variations by nameAtribute
const groupedVariations = computed(() => {
  const groups = {};
  productItems.value.forEach((item) => {
    if (!groups[item.nameAtribute]) {
      groups[item.nameAtribute] = {
        nameAtribute: item.nameAtribute,
        values: new Set()
      };
    }
    groups[item.nameAtribute].values.add(item.value);
  });

  return Object.values(groups).map((group) => ({
    ...group,
    values: Array.from(group.values)
  }));
});

// Find matching variant based on selected variations
const selectedVariant = computed(() => {
  if (Object.keys(selectedVariations.value).length === 0) return null;

  const variants = new Map();
  productItems.value.forEach((item) => {
    const key = item.productItemID;
    if (!variants.has(key)) {
      variants.set(key, {
        productItemID: key,
        price: item.price,
        quantity: item.quantity,
        variations: []
      });
    }
    variants.get(key).variations.push({
      nameAtribute: item.nameAtribute,
      value: item.value
    });
  });
  // Find variant that matches all selected variations
  for (const [_, variant] of variants) {
    const matches = variant.variations.every(
      (v) => selectedVariations.value[v.nameAtribute] === v.value
    );
    if (
      Object.keys(selectedVariations.value).length ===
        variant.variations.length &&
      matches
    )
      return variant;
  }
  return null;
});

// Methods
const fetchProduct = async () => {
  const productID = route.params.productID;
  await productStore.fetchProductById(productID);
};

const selectVariation = (attribute, value) => {
  // If the checkbox is already selected for this attribute, unselect it
  if (selectedVariations.value[attribute] === value) {
    const newVariations = { ...selectedVariations.value };
    delete newVariations[attribute];
    selectedVariations.value = newVariations;
  } else {
    // Select the new value for this attribute
    selectedVariations.value = {
      ...selectedVariations.value,
      [attribute]: value
    };
  }
};

const validateQuantity = () => {
  let val = parseInt(quantity.value) || 1;
  val = Math.max(1, Math.min(val, selectedVariant.value?.quantity || 1));
  quantity.value = val;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const increaseQuantity = () => {
  if (quantity.value < (selectedVariant.value?.quantity || 0)) {
    quantity.value++;
  }
};

const addToCart = async () => {
  try {
    const isLoggedIn = window.sessionStorage.getItem("logined") === "true";

    if (!isLoggedIn) {
      app?.proxy.$notify("Please login to add to cart", "warning");
      return;
    }

    if (!selectedVariant.value) {
      app?.proxy.$notify("Please select all variations", "warning");
      return;
    }

    isAddingToCart.value = true;
    console.log(quantity.value);
    const result = await cartStore.addToCart({
      quantity: quantity.value,
      productItemId: selectedVariant.value.productItemID
    });

    if (result.success) {
      showTooltip.value = true;
      setTimeout(() => {
        showTooltip.value = false;
      }, 2000);
      await fetchProduct();
    } else {
      app?.proxy.$notify(result.error, "error");
    }
  } catch (error) {
    app?.proxy.$notify("Error adding to cart", "error");
  } finally {
    isAddingToCart.value = false;
  }
};

const formatPrice = (price) => {
  return price.toLocaleString("vi-VN");
};

// Add helper method to calculate final price with discount
const calculateFinalPrice = (price) => {
  if (!product.value?.discount || !isDiscountActive.value) return price;
  return (price * (100 - product.value.discount)) / 100;
};

// Add these computed properties
const isDiscountActive = computed(() => {
  return discountStatus.value === "active";
});

const formatDiscountPeriod = computed(() => {
  if (!product.value?.endDate) return "";
  const endDate = parseISO(product.value.endDate);
  return formatDistanceToNow(endDate, { addSuffix: true });
});

const formatStartDate = computed(() => {
  if (!product.value?.startDate) return "";
  const startDate = parseISO(product.value.startDate);
  return formatDistanceToNow(startDate, { addSuffix: true });
});

const discountStatus = computed(() => {
  if (!product.value?.startDate || !product.value?.endDate) return "none";

  const now = new Date();
  const startDate = parseISO(product.value.startDate);
  const endDate = parseISO(product.value.endDate);

  if (isBefore(now, startDate)) {
    return "upcoming";
  } else if (isAfter(now, endDate)) {
    return "expired";
  } else {
    return "active";
  }
});

// Watch for changes in selected variations
watch(
  selectedVariations,
  () => {
    // Reset quantity when variant changes
    quantity.value = 1;
  },
  { deep: true }
);

onMounted(() => {
  fetchProduct();
});
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 20px;
}

.product-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-title {
  font-size: 2em;
  margin: 0;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5em;
  color: var(--secondary-dark-color);
  font-weight: bold;
}

.original-price {
  text-decoration: line-through;
  color: var(--light-text-color);
  font-size: 0.8em;
}

.discounted-price {
  color: var(--primary-color);
}

.discount-badge {
  background-color: var(--primary-color);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7em;
  font-weight: 500;
}

.discount-badge.expired {
  background-color: var(--light-text-color);
}

.discount-badge.upcoming {
  background-color: #f59e0b;
}

.product-description {
  line-height: 1.6;
  color: var(--light-text-color);
}

.product-options {
  margin: 20px 0;
}

.product-options h3 {
  margin-bottom: 10px;
  font-size: 1.1em;
  color: var(--secondary-dark-color);
}

.option-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.checkbox-container {
  display: inline-flex;
  align-items: center;
  margin-right: 16px;
  margin-bottom: 8px;
  cursor: pointer;
}

.checkbox-container input[type="checkbox"] {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label {
  font-size: 0.95em;
  color: var(--secondary-dark-color);
  user-select: none;
}

.variation-option,
.variation-option.active,
.variation-option:hover {
  display: none;
}

.stock-info {
  color: var(--light-text-color);
  font-size: 0.9em;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quantity-selector {
  display: inline-flex;
  align-items: center;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  height: 44px;
  background: white;
  width: fit-content;
}

.quantity-btn {
  width: 40px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--secondary-dark-color);
  font-size: 1.5em;
  cursor: pointer;
  transition: background 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: var(--light-bg-color);
}

.quantity-btn:disabled {
  color: var(--border-color);
  cursor: not-allowed;
}

.quantity-input {
  width: 50px;
  height: 100%;
  text-align: center;
  border: none;
  border-left: 2px solid var(--border-color);
  border-right: 2px solid var(--border-color);
  font-size: 1em;
  color: var(--secondary-dark-color);
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.add-to-cart-btn {
  width: 100%;
  padding: 15px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-to-cart-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: var(--secondary-color);
}

.tooltip {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  z-index: 1000;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s ease;
}

.tooltip.show {
  opacity: 1;
  transform: translateY(0);
}

.tooltip-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--secondary-dark-color);
}

.tooltip-content i {
  color: #10b981;
  font-size: 1.25rem;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: var(--light-text-color);
}

@media (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
  }
}

/* Custom checkbox styling */
.checkbox-container input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  outline: none;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.checkbox-container input[type="checkbox"]:checked {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-container input[type="checkbox"]:checked::after {
  content: "✓";
  position: absolute;
  color: white;
  font-size: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.checkbox-container input[type="checkbox"]:hover {
  border-color: var(--primary-color);
}

.checkbox-container:hover .checkbox-label {
  color: var(--primary-color);
}

.discount-period {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
  margin-top: 8px;
}

.discount-period.active {
  color: var(--primary-color);
}

.discount-period.expired {
  color: var(--light-text-color);
}

.discount-period.upcoming {
  color: #f59e0b; /* Amber/warning color */
}

.discount-period i {
  font-size: 1.1em;
}
</style>
