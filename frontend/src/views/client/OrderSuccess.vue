<template>
  <div class="success-page">
    <div class="success-container">
      <div class="success-content">
        <div class="success-icon">
          <i class="ri-checkbox-circle-line"></i>
        </div>

        <h1>Order Placed Successfully!</h1>
        <p class="message">
          Thank you for your purchase. Your order has been received.
        </p>

        <div class="order-info">
          <div class="info-row">
            <span class="label">Order Number:</span>
            <span class="value">#{{ orderNumber }}</span>
          </div>
          <div class="info-row">
            <span class="label">Order Date:</span>
            <span class="value">{{ formatDate(new Date()) }}</span>
          </div>
          <div class="info-row">
            <span class="label">Total Amount:</span>
            <span class="value">{{ formatPrice(orderTotal) }} đ</span>
          </div>
        </div>

        <div class="next-steps">
          <p>What's next?</p>
          <ul>
            <li>You will receive an order confirmation email</li>
            <li>We will process your order soon</li>
            <li>You can track your order in your profile</li>
          </ul>
        </div>

        <div class="action-buttons">
          <RouterLink to="/profile" class="view-order-btn">
            View Order
          </RouterLink>
          <RouterLink to="/" class="continue-shopping-btn">
            Continue Shopping
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const orderNumber = ref(Math.floor(100000 + Math.random() * 900000));
const orderTotal = ref(0);

function formatDate(date) {
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(price) {
  return price.toLocaleString("vi-VN");
}

onMounted(() => {
  // You can get the order details from route params or state
  //   if (route.params.total) {
  //     orderTotal.value = route.params.total;
  //   }
});
</script>

<style scoped>
.success-page {
  padding: 2rem;
  background: var(--light-bg-color);
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-container {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}

.success-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.success-icon {
  font-size: 4rem;
  color: #10b981;
  margin-bottom: 1rem;
  animation: scaleIn 0.5s ease-out;
}

.success-content h1 {
  color: var(--secondary-dark-color);
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
}

.message {
  color: var(--light-text-color);
  margin-bottom: 2rem;
}

.order-info {
  background: var(--light-bg-color);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.info-row .label {
  color: var(--light-text-color);
}

.info-row .value {
  color: var(--secondary-dark-color);
  font-weight: 500;
}

.next-steps {
  text-align: left;
  margin-bottom: 2rem;
}

.next-steps p {
  color: var(--secondary-dark-color);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.next-steps ul {
  list-style: none;
  padding: 0;
  color: var(--light-text-color);
}

.next-steps li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.next-steps li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--primary-color);
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.view-order-btn,
.continue-shopping-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.view-order-btn {
  background: var(--primary-color);
  color: white;
}

.view-order-btn:hover {
  background: var(--secondary-color);
}

.continue-shopping-btn {
  background: white;
  color: var(--secondary-dark-color);
  border: 1px solid var(--border-color);
}

.continue-shopping-btn:hover {
  background: var(--light-bg-color);
  border-color: var(--primary-color);
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .success-page {
    padding: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
