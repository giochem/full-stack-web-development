<template>
  <div class="success-page">
    <div class="success-container">
      <div class="success-content">
        <div class="success-icon">
          <i class="ri-checkbox-circle-line"></i>
        </div>

        <h1>{{ $t("Views.Client.OrderSuccess.OrderPlacedSuccessfully") }}</h1>
        <p class="message">
          {{ $t("Views.Client.OrderSuccess.ThankYouForPurchase") }}
        </p>

        <div class="order-info">
          <div class="info-row">
            <span class="label"
              >{{ $t("Views.Client.OrderSuccess.OrderDate") }}:</span
            >
            <span class="value">{{ formatDate(new Date()) }}</span>
          </div>
        </div>

        <div class="next-steps">
          <p>{{ $t("Views.Client.OrderSuccess.WhatsNext") }}</p>
          <ul>
            <li>
              {{ $t("Views.Client.OrderSuccess.OrderConfirmationEmail") }}
            </li>
            <li>{{ $t("Views.Client.OrderSuccess.ProcessOrderSoon") }}</li>
            <li>{{ $t("Views.Client.OrderSuccess.TrackOrderInProfile") }}</li>
          </ul>
        </div>

        <div class="action-buttons">
          <RouterLink to="/profile" class="view-order-btn">
            {{ $t("Views.Client.OrderSuccess.ViewOrder") }}
          </RouterLink>
          <RouterLink to="/" class="continue-shopping-btn">
            {{ $t("Views.Client.OrderSuccess.ContinueShopping") }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "@/stores/order";
import { storeToRefs } from "pinia";
const { successOrder } = storeToRefs(useOrderStore());
const router = useRouter();
const orderStore = useOrderStore();

function formatDate(date) {
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

onMounted(() => {
  if (!successOrder.value) {
    router.push("/");
  }
});

onUnmounted(() => {
  orderStore.clearSuccessOrder();
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
