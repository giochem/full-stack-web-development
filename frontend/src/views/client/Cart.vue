<template>
  <div class="cart-page">
    <div class="cart-container">
      <div class="cart-header">
        <h1>Shopping Cart</h1>
      </div>

      <div v-if="cartItems.length > 0" class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.cartID" class="cart-item">
            <div class="item-image">
              <img
                :src="`http://localhost:5000/uploads/${item.linkImage}`"
                :alt="item.name"
              />
            </div>

            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <div class="item-price">
                <span v-if="item.discount && isDiscountActive(item)" class="original-price">
                  {{ formatPrice(item.price) }} đ
                </span>
                <span :class="{ 'discounted-price': isDiscountActive(item) }">
                  {{ formatPrice(calculateFinalPrice(item)) }} đ
                </span>
                <span v-if="item.discount && isDiscountActive(item)" class="discount-badge">
                  -{{ item.discount }}%
                </span>
              </div>

              <div class="item-options">
                <span class="item-color">Color: {{ item.color }}</span>
                <span class="item-size">Size: {{ item.size }}</span>
              </div>

              <div class="item-actions">
                <div class="quantity-controls">
                  <button
                    @click="updateQuantity(item, -1)"
                    :disabled="item.quantity <= 1"
                    class="quantity-btn"
                  >
                    <i class="ri-subtract-line"></i>
                  </button>

                  <span class="quantity">{{ item.quantity }}</span>

                  <button @click="updateQuantity(item, 1)" class="quantity-btn">
                    <i class="ri-add-line"></i>
                  </button>
                </div>

                <button @click="removeItem(item)" class="remove-btn">
                  <i class="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>

            <div class="item-total">
              {{ formatPrice(calculateItemTotal(item)) }} đ
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>{{ formatPrice(originalSubtotal) }} đ</span>
          </div>
          <div v-if="totalSavings > 0" class="summary-row savings">
            <span>Discount Savings</span>
            <span>-{{ formatPrice(totalSavings) }} đ</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>{{ formatPrice(shippingFee) }} đ</span>
          </div>
          <div class="summary-total">
            <span>Total</span>
            <span>{{ formatPrice(total) }} đ</span>
          </div>
          <button @click="checkout" class="checkout-btn">
            Proceed to Checkout
          </button>
        </div>
      </div>

      <div v-else class="empty-cart">
        <i class="ri-shopping-cart-line"></i>
        <p>Your cart is empty</p>
        <RouterLink to="/" class="continue-shopping">
          Continue Shopping
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { APP_CONSTANTS } from "@/utils/constants";
import { parseISO, isAfter, isBefore } from "date-fns";

const router = useRouter();
const cartStore = useCartStore();
const cartItems = ref([]);
const shippingFee = APP_CONSTANTS.ORDER.SHIPPING_FEE;

const originalSubtotal = computed(() => {
  return cartItems.value.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );
});

const totalSavings = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    if (!isDiscountActive(item)) return sum;
    const savings = (item.price * item.discount / 100) * item.quantity;
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
  const result = await cartStore.updateCartCount();
  if (result.success) {
    cartItems.value = result.data;
  }
}

async function updateQuantity(item, change) {
  const newQuantity = item.quantity + change;
  if (newQuantity < 1) return;

  const result = await cartStore.addToCart({
    quantity: newQuantity,
    productItemId: item.productItemID,
  });
  if (result.success) {
    await fetchCartItems();
  }
}

async function removeItem(item) {
  const result = await cartStore.addToCart({
    quantity: 0,
    productItemId: item.productItemID,
  });
  if (result.success) {
    await fetchCartItems();
  }
}

function checkout() {
  router.push("/checkout");
}

onMounted(() => {
  fetchCartItems();
});

function isDiscountActive(item) {
  if (!item.startDate || !item.endDate || !item.discount) return false;
  
  const now = new Date();
  const startDate = parseISO(item.startDate);
  const endDate = parseISO(item.endDate);
  
  return isAfter(now, startDate) && isBefore(now, endDate);
}

function calculateFinalPrice(item) {
  if (!isDiscountActive(item)) return item.price;
  return (item.price * (100 - item.discount)) / 100;
}

function calculateItemTotal(item) {
  return calculateFinalPrice(item) * item.quantity;
}
</script>

<style scoped>
.cart-page {
  padding: 2rem;
  background: var(--light-bg-color);
  min-height: calc(100vh - 60px);
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
}

.cart-header {
  margin-bottom: 2rem;
}

.cart-header h1 {
  font-size: 2rem;
  color: var(--secondary-dark-color);
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.cart-items {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 1.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.item-image img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-name {
  font-size: 1.1rem;
  color: var(--secondary-dark-color);
}

.item-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
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

.item-options {
  display: flex;
  gap: 1rem;
  color: var(--light-text-color);
  font-size: 0.9rem;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.25rem;
}

.quantity-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--secondary-dark-color);
}

.quantity-btn:disabled {
  color: var(--border-color);
  cursor: not-allowed;
}

.quantity {
  min-width: 2rem;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.5rem;
}

.item-total {
  font-weight: 500;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.cart-summary {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
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

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background: var(--secondary-color);
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-cart i {
  font-size: 4rem;
  color: var(--light-text-color);
  margin-bottom: 1rem;
}

.empty-cart p {
  color: var(--secondary-dark-color);
  margin-bottom: 1.5rem;
}

.continue-shopping {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.continue-shopping:hover {
  background: var(--secondary-color);
}

.savings {
  color: var(--primary-color);
  font-weight: 500;
  font-style: italic;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 100px 1fr;
  }

  .item-total {
    grid-column: 1 / -1;
    text-align: right;
  }
}
</style>
