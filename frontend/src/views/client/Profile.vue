<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-header">
        <h1>My Profile</h1>
      </div>

      <div class="profile-content">
        <!-- User Info Section -->
        <div class="profile-section">
          <h2>Account Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Username</label>
              <p>{{ authStore.user?.username }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>{{ authStore.user?.email }}</p>
            </div>
            <div class="info-item">
              <label>Role</label>
              <p>{{ authStore.user?.role }}</p>
            </div>
          </div>
          <button @click="showEditForm = true" class="edit-btn">
            <i class="ri-edit-line"></i>
            Edit Profile
          </button>
        </div>

        <!-- Order History Section -->
        <div class="profile-section">
          <h2>Order History</h2>
          <div class="orders-list" v-if="orderStore.orders.length > 0">
            <div
              v-for="order in orderStore.orders"
              :key="order.orderID"
              class="order-card"
            >
              <div class="order-header">
                <span class="order-id">Order #{{ order.orderID }}</span>
                <span :class="['order-status', order.status]">{{
                  order.status
                }}</span>
              </div>
              <div class="order-details">
                <div class="order-info">
                  <p class="order-date">{{ formatDate(order.createdAt) }}</p>
                  <div class="shipping-details">
                    <p><i class="ri-user-line"></i> {{ order.fullName }}</p>
                    <p><i class="ri-phone-line"></i> {{ order.phone }}</p>
                    <p><i class="ri-map-pin-line"></i> {{ order.address }}</p>
                    <p v-if="order.note">
                      <i class="ri-file-list-line"></i> {{ order.note }}
                    </p>
                  </div>
                </div>
                <button
                  @click="viewOrderDetails(order.orderID)"
                  class="view-btn"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
          <div v-else class="empty-orders">
            <i class="ri-shopping-bag-line"></i>
            <p>No orders yet</p>
          </div>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <div v-if="showEditForm" class="modal-overlay">
        <div class="modal-content">
          <form @submit.prevent="handleUpdateProfile" class="edit-form">
            <h2>Edit Profile</h2>

            <div class="form-group">
              <label for="username">Username</label>
              <input
                id="username"
                v-model="form.username"
                type="text"
                placeholder="Enter username"
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Enter email"
              />
            </div>

            <div class="form-group">
              <label for="password">New Password (optional)</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Enter new password"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn">Save Changes</button>
              <button
                type="button"
                @click="showEditForm = false"
                class="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useOrderStore } from "@/stores/order";

const app = getCurrentInstance();
const router = useRouter();
const authStore = useAuthStore();
const orderStore = useOrderStore();

const showEditForm = ref(false);
const form = ref({
  username: "",
  email: "",
  password: "",
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(price) {
  return price.toLocaleString("vi-VN");
}

function viewOrderDetails(orderID) {
  alert("this function is not implemented yet");
  // router.push(`/orders/${orderID}`);
}

async function handleUpdateProfile() {
  const { username, email, password } = form.value;

  if (!username || !email) {
    app?.proxy.$notify("Please enter required fields", "warning");
    return;
  }

  const data = { username, email };
  if (password) data.password = password;

  const result = await authStore.updateProfile(data);
  if (result.success) {
    app?.proxy.$notify("Profile updated successfully", "success");
    showEditForm.value = false;
  } else {
    app?.proxy.$notify(result.error, "error");
  }
}

onMounted(async () => {
  const profileResult = await authStore.fetchProfile();
  if (profileResult.success) {
    form.value = {
      username: authStore.user.username,
      email: authStore.user.email,
      password: "",
    };
  }

  const ordersResult = await orderStore.fetchOwnerOrders();
  if (!ordersResult.success) {
    app?.proxy.$notify(ordersResult.error, "error");
  }
});
</script>

<style scoped>
.profile-page {
  padding: 2rem;
  background: var(--light-bg-color);
  min-height: calc(100vh - 60px);
}

.profile-container {
  max-width: 1000px;
  margin: 0 auto;
}

.profile-header {
  margin-bottom: 2rem;
}

.profile-header h1 {
  font-size: 2rem;
  color: var(--secondary-dark-color);
}

.profile-content {
  display: grid;
  gap: 2rem;
}

.profile-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-section h2 {
  font-size: 1.25rem;
  color: var(--secondary-dark-color);
  margin-bottom: 1.5rem;
}

.info-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-item label {
  display: block;
  color: var(--light-text-color);
  margin-bottom: 0.5rem;
}

.info-item p {
  font-size: 1.1rem;
  color: var(--secondary-dark-color);
}

.edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-btn:hover {
  background: var(--secondary-color);
}

.orders-list {
  display: grid;
  gap: 1rem;
}

.order-card {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 1rem;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.order-id {
  font-weight: 500;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.order-status.pending {
  background: #fef3c7;
  color: #92400e;
}

.order-status.processing {
  background: #dbeafe;
  color: #1e40af;
}

.order-status.completed {
  background: #d1fae5;
  color: #065f46;
}

.order-status.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.order-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  flex: 1;
}

.order-date {
  color: var(--light-text-color);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.shipping-details {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--secondary-dark-color);
}

.shipping-details p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.25rem 0;
}

.shipping-details i {
  color: var(--light-text-color);
  font-size: 1.1rem;
}

.view-btn {
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.view-btn:hover {
  background: var(--light-bg-color);
  border-color: var(--primary-color);
}

.empty-orders {
  text-align: center;
  padding: 3rem;
  color: var(--light-text-color);
}

.empty-orders i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.modal-content.order-details-modal {
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h2 {
  margin: 0;
  color: var(--secondary-dark-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--light-text-color);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
}

.close-btn:hover {
  color: var(--secondary-dark-color);
}

.detail-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.processing {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.date-info {
  color: var(--light-text-color);
}

.order-items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: var(--light-bg-color);
  border-radius: 8px;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details h4 {
  margin: 0 0 0.5rem 0;
  color: var(--secondary-dark-color);
}

.item-meta {
  color: var(--light-text-color);
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.item-price {
  color: var(--primary-color);
  font-weight: 500;
  margin: 0;
}

.item-total {
  font-weight: 500;
  color: var(--primary-color);
}

.shipping-info p {
  margin: 0.5rem 0;
  color: var(--secondary-dark-color);
}

.shipping-info strong {
  color: var(--light-text-color);
  margin-right: 0.5rem;
}

.summary {
  background: var(--light-bg-color);
  padding: 1.5rem;
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: var(--light-text-color);
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  font-weight: 500;
  color: var(--secondary-dark-color);
  font-size: 1.1rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.edit-form h2 {
  text-align: center;
  margin-bottom: 1rem;
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

.form-group input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.save-btn,
.cancel-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.save-btn {
  background: var(--primary-color);
  color: white;
  border: none;
}

.save-btn:hover {
  background: var(--secondary-color);
}

.cancel-btn {
  background: white;
  border: 1px solid var(--border-color);
  color: var(--secondary-dark-color);
}

.cancel-btn:hover {
  background: var(--light-bg-color);
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
