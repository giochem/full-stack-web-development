<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Edit Collection</h1>
        </div>
      </div>
    </header>

    <div class="form-container">
      <form class="admin-form" @submit.prevent="save">
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            id="name"
            v-model="collection.name" 
            type="text"
            placeholder="Enter collection name"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="primary-btn">
            Save Changes
          </button>
          <RouterLink to="/admin/manage-collection" class="secondary-btn">
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
import axios from "axios";

const route = useRoute();
const router = useRouter();

const collection = ref({
  name: "",
});

async function save() {
  try {
    await axios.put(
      `http://localhost:5000/api/collections/${route.params.collectionID}`,
      collection.value,
      { withCredentials: true }
    );
    router.push("/admin/manage-collection");
  } catch (error) {
    console.error("Error updating collection:", error);
  }
}

onMounted(async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/collections/${route.params.collectionID}`,
      { withCredentials: true }
    );
    collection.value = response.data.data[0];
  } catch (error) {
    console.error("Error fetching collection:", error);
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
  .form-actions {
    flex-direction: column;
  }
}
</style>
