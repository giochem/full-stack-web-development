<template>
  <div class="product-detail">
    <div class="product-container" v-if="product">
      <div class="product-image">
        <img :src="productImage" :alt="product.name" />
      </div>

      <div class="product-info">
        <h1 class="product-title">{{ product.name }}</h1>
        <div class="product-price">{{ formatPrice(product.price) }} đ</div>
        <div class="product-description">{{ product.description }}</div>

        <!-- Color Selection -->
        <div class="product-options">
          <h3>Color</h3>
          <div class="option-buttons">
            <button
              v-for="color in getColorOptions()"
              :key="color"
              :class="['color-option', { active: selectedColor === color }]"
              @click="selectedColor = color"
            >
              {{ color }}
            </button>
          </div>
        </div>

        <!-- Size Selection -->
        <div class="product-options">
          <h3>Size</h3>
          <div class="option-buttons">
            <button
              v-for="size in getSizeOptions()"
              :key="size"
              :class="['size-option', { active: selectedSize === size }]"
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Stock Information -->
        <div class="stock-info">In Stock: {{ product.quantity }} items</div>

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
              :max="product.quantity"
              @input="validateQuantity"
              class="quantity-input"
            />
            <button
              class="quantity-btn"
              @click="increaseQuantity"
              :disabled="quantity >= product.quantity"
            >
              <span class="plus">+</span>
            </button>
          </div>
          <button
            @click="addToCart"
            class="add-to-cart-btn"
            :disabled="isAddingToCart"
          >
            {{ isAddingToCart ? "Adding..." : "Add to Cart" }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="loading">Loading...</div>

    <!-- Success Tooltip -->
    <div v-if="showTooltip" class="tooltip" :class="{ show: showTooltip }">
      <div class="tooltip-content">
        <i class="ri-check-line"></i>
        <span>Added to cart successfully!</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useCartStore } from "@/stores/cart";

const app = getCurrentInstance();
const route = useRoute();
const product = ref(null);
const quantity = ref(1);
const selectedColor = ref("");
const selectedSize = ref("");
const cartStore = useCartStore();
const showTooltip = ref(false);
const isAddingToCart = ref(false);

const fetchProduct = async () => {
  try {
    const productID = route.params.productID;
    const response = await axios.get(
      `http://localhost:5000/api/products/${productID}`
    );
    product.value = response.data.data[0];

    // Set default selections
    if (product.value) {
      selectedColor.value = product.value.color.split("-")[0];
      selectedSize.value = product.value.size.split("-")[0];
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

const getColorOptions = () => {
  return product.value?.color.split("-") || [];
};

const getSizeOptions = () => {
  return product.value?.size.split("-") || [];
};

const validateQuantity = () => {
  // Convert to number and ensure it's within bounds
  let val = parseInt(quantity.value) || 1;
  val = Math.max(1, Math.min(val, product.value?.quantity || 1));
  quantity.value = val;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const increaseQuantity = () => {
  if (quantity.value < product.value?.quantity) {
    quantity.value++;
  }
};

const addToCart = async () => {
  try {
    // Check if user is logged in
    const isLoggedIn = window.sessionStorage.getItem("logined") === "true";

    if (!isLoggedIn) {
      app?.proxy.$notify("Please login to add to cart", "warning");
      return;
    }

    // Check if color and size are selected
    if (!selectedColor.value || !selectedSize.value) {
      app?.proxy.$notify("Please select color and size", "warning");
      return;
    }

    isAddingToCart.value = true;

    const response = await axios.put(
      "http://localhost:5000/api/carts/",
      {
        productID: product.value.productID,
        quantity: quantity.value,
      },
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      // Show tooltip
      showTooltip.value = true;
      setTimeout(() => {
        showTooltip.value = false;
      }, 2000);

      // Update cart count
      await cartStore.updateCartCount();

      // Reload product data
      await fetchProduct();
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    const errorMessage =
      error.response?.data?.message || "Error adding to cart";
    app?.proxy.$notify(errorMessage, "error");
  } finally {
    isAddingToCart.value = false;
  }
};

// Add price formatter function
const formatPrice = (price) => {
  return price.toLocaleString("vi-VN");
};

// Add computed property for product image
const productImage = computed(() => {
  return product.value?.linkImage || "https://via.placeholder.com/400";
});

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
  font-size: 1.5em;
  color: var(--secondary-dark-color);
  font-weight: bold;
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
  gap: 10px;
  flex-wrap: wrap;
}

.color-option,
.size-option {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-option.active,
.size-option.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.color-option:hover,
.size-option:hover {
  border-color: var(--primary-color);
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
  -moz-appearance: textfield;
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
</style>
