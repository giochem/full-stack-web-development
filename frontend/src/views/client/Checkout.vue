<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <div class="checkout-header">
        <h1>Checkout</h1>
      </div>

      <div class="checkout-content">
        <!-- Shipping Information -->
        <div class="checkout-section">
          <h2>Shipping Information</h2>
          <form class="shipping-form" @submit.prevent="placeOrder">
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <input
                id="fullName"
                v-model="shippingInfo.fullName"
                type="text"
                required
                placeholder="Enter your full name"
              />
            </div>

            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input
                id="phone"
                v-model="shippingInfo.phone"
                type="tel"
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div class="form-group">
              <label for="address">Delivery Address</label>
              <textarea
                id="address"
                v-model="shippingInfo.address"
                required
                rows="3"
                placeholder="Enter your delivery address"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="note">Order Notes (Optional)</label>
              <textarea
                id="note"
                v-model="shippingInfo.note"
                rows="2"
                placeholder="Any special instructions for delivery"
              ></textarea>
            </div>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="checkout-section order-summary">
          <h2>Order Summary</h2>
          <div class="order-items">
            <div
              v-for="item in cartItems"
              :key="item.cartID"
              class="order-item"
            >
              <div class="item-image">
                <img
                  :src="`${APP_CONSTANTS.UPLOAD.UPLOAD_URL}${item.image}`"
                  :alt="item.name"
                />
              </div>
              <div class="item-info">
                <h3>{{ item.name }}</h3>
                <p class="item-details">
                  {{ item.color }} / {{ item.size }} × {{ item.quantity }}
                </p>
                <div class="item-price">
                  <span
                    v-if="item.discount && isDiscountActive(item)"
                    class="original-price"
                  >
                    {{ formatPrice(item.price * item.quantity) }} đ
                  </span>
                  <span :class="{ 'discounted-price': isDiscountActive(item) }">
                    {{ formatPrice(calculateItemTotal(item)) }} đ
                  </span>
                  <span
                    v-if="item.discount && isDiscountActive(item)"
                    class="discount-badge"
                  >
                    -{{ item.discount }}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="price-summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ formatPrice(originalSubtotal) }} đ</span>
            </div>
            <div v-if="totalSavings > 0" class="summary-row savings">
              <span>Discount Savings</span>
              <span>-{{ formatPrice(totalSavings) }} đ</span>
            </div>
            <div class="summary-row">
              <span>Shipping Fee</span>
              <span>{{ formatPrice(shippingFee) }} đ</span>
            </div>
            <div class="summary-total">
              <span>Total</span>
              <span>{{ formatPrice(total) }} đ</span>
            </div>
          </div>

          <button
            @click="placeOrder"
            class="place-order-btn"
            :disabled="isProcessing"
          >
            {{ isProcessing ? "Processing..." : "Place Order" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { useOrderStore } from "@/stores/order";
import { APP_CONSTANTS } from "@/utils/constants";
import { parseISO, isAfter, isBefore } from "date-fns";

const app = getCurrentInstance();
const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();

const cartItems = ref([]);
const isProcessing = ref(false);
const shippingFee = APP_CONSTANTS.ORDER.SHIPPING_FEE;

const shippingInfo = ref({
  fullName: "",
  phone: "",
  address: "",
  note: "",
});

const originalSubtotal = computed(() => {
  return cartItems.value.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
});

const totalSavings = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    if (!isDiscountActive(item)) return sum;
    const savings = ((item.price * item.discount) / 100) * item.quantity;
    return sum + savings;
  }, 0);
});

const total = computed(() => {
  return originalSubtotal.value - totalSavings.value + shippingFee;
});

function formatPrice(price) {
  return price.toLocaleString("vi-VN");
}

async function fetchCartItems() {
  try {
    const response = await cartStore.updateCartCount();
    if (response.success) {
      cartItems.value = response.data;
    } else {
      app?.proxy.$notify("Error fetching cart items", "error");
    }
  } catch (error) {
    app?.proxy.$notify("Error fetching cart items", "error");
  }
}

async function placeOrder() {
  if (!validateForm()) return;

  try {
    isProcessing.value = true;
    const orderData = {
      ...shippingInfo.value,
    };

    const result = await orderStore.createOrder(orderData);
    if (result.success) {
      router.push("/order-success");
    } else {
      app?.proxy.$notify(result.error, "error");
    }
  } catch (error) {
    app?.proxy.$notify("Error placing order", "error");
  } finally {
    isProcessing.value = false;
  }
}

function validateForm() {
  if (!shippingInfo.value.fullName.trim()) {
    app?.proxy.$notify("Please enter your full name", "warning");
    return false;
  }
  if (!shippingInfo.value.phone.trim()) {
    app?.proxy.$notify("Please enter your phone number", "warning");
    return false;
  }
  if (!shippingInfo.value.address.trim()) {
    app?.proxy.$notify("Please enter your delivery address", "warning");
    return false;
  }
  return true;
}

function calculateFinalPrice(item) {
  if (!isDiscountActive(item)) return item.price;
  return (item.price * (100 - item.discount)) / 100;
}

function calculateItemTotal(item) {
  return calculateFinalPrice(item) * item.quantity;
}

function isDiscountActive(item) {
  if (!item.startDate || !item.endDate || !item.discount) return false;

  const now = new Date();
  const startDate = parseISO(item.startDate);
  const endDate = parseISO(item.endDate);

  return isAfter(now, startDate) && isBefore(now, endDate);
}

onMounted(() => {
  fetchCartItems();
});
</script>

<style scoped>
.checkout-page {
  padding: 2rem;
  background: var(--light-bg-color);
  min-height: calc(100vh - 60px);
}

.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
}

.checkout-header {
  margin-bottom: 2rem;
}

.checkout-header h1 {
  font-size: 2rem;
  color: var(--secondary-dark-color);
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

.checkout-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.checkout-section h2 {
  font-size: 1.25rem;
  color: var(--secondary-dark-color);
  margin-bottom: 1.5rem;
}

.shipping-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--secondary-dark-color);
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.order-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.item-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.item-details {
  color: var(--light-text-color);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.original-price {
  text-decoration: line-through;
  color: var(--light-text-color);
  font-size: 0.9em;
}

.discounted-price {
  color: var(--primary-color);
  font-weight: 500;
}

.discount-badge {
  background-color: var(--primary-color);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75em;
  font-weight: 500;
}

.savings {
  color: var(--primary-color);
  font-weight: 500;
  font-style: italic;
}

.price-summary {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: var(--secondary-dark-color);
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  margin-top: 0.5rem;
  border-top: 1px solid var(--border-color);
  font-weight: 500;
  font-size: 1.1rem;
  color: var(--primary-color);
}

.place-order-btn {
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.place-order-btn:hover:not(:disabled) {
  background: var(--secondary-color);
}

.place-order-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 968px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .checkout-page {
    padding: 1rem;
  }
}
</style>
