<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Add Promotion</h1>
        </div>
      </div>
    </header>

    <div class="form-container">
      <form class="admin-form" @submit.prevent="save">
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            id="name"
            v-model="promotion.name" 
            type="text"
            placeholder="Enter promotion name"
          />
        </div>

        <div class="form-group">
          <label for="reduce">Discount (%)</label>
          <input 
            id="reduce"
            v-model="promotion.reduce" 
            type="number"
            min="0"
            max="100"
            placeholder="Enter discount percentage"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="startTime">Start Time</label>
            <input 
              id="startTime"
              v-model="promotion.startTime" 
              type="datetime-local"
            />
          </div>

          <div class="form-group">
            <label for="endTime">End Time</label>
            <input 
              id="endTime"
              v-model="promotion.endTime" 
              type="datetime-local"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="productIDs">Product IDs</label>
          <input 
            id="productIDs"
            v-model="promotion.productIDs" 
            type="text"
            placeholder="Enter product IDs (comma-separated)"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="primary-btn">
            Add Promotion
          </button>
          <RouterLink to="/admin/manage-promotion" class="secondary-btn">
            Cancel
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const promotion = ref({
  name: "",
  reduce: 0,
  startTime: "",
  endTime: "",
  productIDs: "",
});

async function save() {
  try {
    const productIDArray = promotion.value.productIDs
      .split(",")
      .map(id => parseInt(id.trim()));

    const data = {
      ...promotion.value,
      productIDs: productIDArray,
      reduce: parseInt(promotion.value.reduce),
      startTime: promotion.value.startTime.replace("T", " "),
      endTime: promotion.value.endTime.replace("T", " "),
    };

    await axios.post(
      "http://localhost:5000/api/promotions",
      data,
      { withCredentials: true }
    );
    
    router.push("/admin/manage-promotion");
  } catch (error) {
    console.error("Error adding promotion:", error);
  }
}
</script>

<style scoped>
/* Use the same styles as EditProduct.vue */
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
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
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
