<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Edit Order</h1>
        </div>
      </div>
    </header>

    <div class="form-container">
      <form class="admin-form" @submit.prevent="save">
        <div class="form-group">
          <label for="userID">User ID</label>
          <input id="userID" v-model="order.userID" type="text" disabled />
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" v-model="order.status" class="form-select">
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div class="order-details">
          <h3>Order Items</h3>
          <div class="order-items">
            <div
              v-for="item in order.items"
              :key="item.productID"
              class="order-item"
            >
              <div class="item-info">
                <span class="item-name">{{ item.productName }}</span>
                <span class="item-quantity">x{{ item.quantity }}</span>
                <span class="item-price">{{ formatPrice(item.price) }} đ</span>
              </div>
            </div>
          </div>
          <div class="order-total">
            <span>Total Amount:</span>
            <strong>{{ formatPrice(order.totalAmount) }} đ</strong>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="primary-btn">Save Changes</button>
          <RouterLink to="/admin/manage-order" class="secondary-btn">
            Cancel
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/utils/axios";

const route = useRoute();
const router = useRouter();

const order = ref({
  userID: "",
  status: "",
  items: [],
  totalAmount: 0,
  createdAt: ""
});

function formatPrice(price) {
  return price.toLocaleString("vi-VN");
}

async function save() {
  try {
    await axios.put(
      `/orders/${route.params.orderID}`,
      {
        status: order.value.status
      },
      { withCredentials: true }
    );
    router.push("/admin/manage-order");
  } catch (error) {
    console.error("Error updating order:", error);
  }
}

onMounted(async () => {
  try {
    const response = await axios.get(`/orders/${route.params.orderID}`, {
      withCredentials: true
    });
    order.value = response.data.data[0];
  } catch (error) {
    console.error("Error fetching order:", error);
  }
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
  justify-content: center;
  align-items: center;
}

.header-title {
  text-align: center;
}

.header-title h1 {
  font-size: 1.5rem;
  color: var(--secondary-dark-color);
  margin: 0;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.admin-form {
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
.form-select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:disabled {
  background-color: var(--light-bg-color);
  cursor: not-allowed;
}

.form-select {
  background-color: white;
  cursor: pointer;
}

.form-group input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.order-details {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 1rem;
}

.order-details h3 {
  margin: 0 0 1rem;
  color: var(--secondary-dark-color);
  font-size: 1.1rem;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.order-item {
  padding: 0.75rem;
  background: var(--light-bg-color);
  border-radius: 4px;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-weight: 500;
}

.item-quantity {
  color: var(--secondary-dark-color);
}

.item-price {
  color: var(--primary-color);
  font-weight: 500;
}

.order-total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.primary-btn,
.secondary-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-decoration: none;
  text-align: center;
}

.primary-btn {
  background: var(--primary-color);
  color: white;
}

.primary-btn:hover {
  background: var(--secondary-color);
}

.secondary-btn {
  background: white;
  border: 1px solid var(--border-color);
  color: var(--secondary-dark-color);
}

.secondary-btn:hover {
  background: var(--light-bg-color);
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
}
</style>
