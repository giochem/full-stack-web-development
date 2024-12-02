<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Add User</h1>
        </div>
      </div>
    </header>

    <div class="form-container">
      <form class="admin-form" @submit.prevent="save">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="user.email" 
            type="email"
            placeholder="Enter email address"
          />
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input 
            id="username"
            v-model="user.username" 
            type="text"
            placeholder="Enter username"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="user.password" 
            type="password"
            placeholder="Enter password"
          />
        </div>

        <div class="form-group">
          <label for="role">Role</label>
          <select 
            id="role"
            v-model="user.role"
            class="form-select"
          >
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="primary-btn">
            Add User
          </button>
          <RouterLink to="/admin/manage-user" class="secondary-btn">
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

const user = ref({
  email: "",
  username: "",
  password: "",
  role: "client",
});

async function save() {
  try {
    await axios.post(
      "http://localhost:5000/api/users",
      user.value,
      { withCredentials: true }
    );
    router.push("/admin/manage-user");
  } catch (error) {
    console.error("Error adding user:", error);
  }
}
</script>

<style scoped>
/* Use the same styles as other admin forms */
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

.form-group input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-select {
  background-color: white;
  cursor: pointer;
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
