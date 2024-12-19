<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>{{ $t("Views.Admin.EditUser.Title") }}</h1>
        </div>
      </div>
    </header>

    <div class="form-container">
      <form class="admin-form" @submit.prevent="handleSave">
        <div class="form-group">
          <label for="email">{{ $t("Views.Admin.EditUser.LabelEmail") }}</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            :placeholder="$t('Views.Admin.EditUser.PlaceholderEmail')"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="username">{{
            $t("Views.Admin.EditUser.LabelUsername")
          }}</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            :placeholder="$t('Views.Admin.EditUser.PlaceholderUsername')"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">{{
            $t("Views.Admin.EditUser.LabelPassword")
          }}</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="on"
            :placeholder="$t('Views.Admin.EditUser.PlaceholderPassword')"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="role">{{ $t("Views.Admin.EditUser.LabelRole") }}</label>
          <select
            id="role"
            v-model="form.role"
            class="form-select"
            :disabled="loading"
          >
            <option value="client">
              {{ $t("Views.Admin.EditUser.OptionClient") }}
            </option>
            <option value="admin">
              {{ $t("Views.Admin.EditUser.OptionAdmin") }}
            </option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="primary-btn" :disabled="loading">
            {{ $t("Views.Admin.EditUser.ButtonSaveChanges") }}
          </button>
          <RouterLink
            to="/admin/manage-user"
            class="secondary-btn"
            :class="{ disabled: loading }"
          >
            {{ $t("Views.Admin.EditUser.ButtonCancel") }}
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/constants";

const app = getCurrentInstance();
const route = useRoute();
const router = useRouter();

const form = ref({
  email: "",
  username: "",
  password: "",
  role: "client"
});

const loading = ref(false);

async function handleSave() {
  loading.value = true;
  try {
    const response = await axios({
      method: API_ENDPOINTS.USERS.UPDATE.method,
      url: API_ENDPOINTS.USERS.UPDATE.url(route.params.userID),
      data: form.value
    });
    app?.proxy.$notify(response.data.message, "success");
    router.push("/admin/manage-user");
  } catch (error) {
    console.error("Error updating user:", error);
    app?.proxy.$notify(error.response?.data?.message || error.message, "error");
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    const response = await axios({
      method: API_ENDPOINTS.USERS.GET_BY_ID.method,
      url: API_ENDPOINTS.USERS.GET_BY_ID.url(route.params.userID)
    });
    const user = response.data.data[0];
    form.value = {
      email: user.email,
      username: user.username,
      password: "",
      role: user.role
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    app?.proxy.$notify(error.response?.data?.message || error.message, "error");
    router.push("/admin/manage-user");
  } finally {
    loading.value = false;
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

.form-group input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-group input:disabled,
.form-select:disabled {
  background-color: var(--light-bg-color);
  cursor: not-allowed;
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

.primary-btn:hover:not(:disabled) {
  background: var(--secondary-color);
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary-btn {
  background: white;
  border: 1px solid var(--border-color);
  color: var(--secondary-dark-color);
}

.secondary-btn:hover:not(.disabled) {
  background: var(--light-bg-color);
}

.secondary-btn.disabled {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
}
</style>
