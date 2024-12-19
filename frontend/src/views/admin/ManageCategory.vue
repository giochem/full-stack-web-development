<template>
  <div class="manage-category">
    <div class="header">
      <h2>{{ $t("Views.Admin.ManageCategories.Title") }}</h2>
      <button class="btn-primary" @click="openAddModal">
        <i class="ri-add-line"></i>
        {{ $t("Views.Admin.ManageCategories.AddCategory") }}
      </button>
    </div>

    <div v-if="categoryStore.loading" class="loading">
      <i class="ri-loader-4-line spin"></i>
      {{ $t("Views.Admin.ManageCategories.Loading") }}
    </div>

    <div v-else-if="categoryStore.error" class="error">
      {{ categoryStore.error }}
    </div>

    <div v-else-if="!categoryStore.categories.length" class="empty-state">
      <i class="ri-inbox-line"></i>
      <p>{{ $t("Views.Admin.ManageCategories.NoCategories") }}</p>
    </div>

    <div v-else class="categories-list">
      <table>
        <thead>
          <tr>
            <th>{{ $t("Views.Admin.ManageCategories.CategoryName") }}</th>
            <th>{{ $t("Views.Admin.ManageCategories.Actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in categoryStore.categories"
            :key="category.categoryID"
          >
            <td>{{ category.name }}</td>
            <td class="actions">
              <button
                class="btn-icon"
                @click="editCategory(category)"
                title="Edit"
              >
                <i class="ri-edit-line"></i>
              </button>
              <button
                class="btn-icon delete"
                @click="confirmDelete(category)"
                title="Delete"
              >
                <i class="ri-delete-bin-line"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-model="showModal" :title="modalTitle">
      <form @submit.prevent="handleSubmit" class="category-form">
        <div class="form-group">
          <label for="name">{{
            $t("Views.Admin.ManageCategories.CategoryName")
          }}</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            :placeholder="
              $t('Views.Admin.ManageCategories.PlaceholderCategoryName')
            "
            :class="{ error: validationErrors.name }"
          />
          <span v-if="validationErrors.name" class="error-message">
            {{ validationErrors.name }}
          </span>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="closeModal">
            {{ $t("Views.Admin.ManageCategories.Cancel") }}
          </button>
          <button
            type="submit"
            class="btn-primary"
            :disabled="categoryStore.loading"
          >
            <i v-if="categoryStore.loading" class="ri-loader-4-line spin"></i>
            {{
              isEditing
                ? $t("Views.Admin.ManageCategories.Update")
                : $t("Views.Admin.ManageCategories.Create")
            }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from "vue";
import { useCategoryStore } from "@/stores/category";
import Modal from "@/components/common/Modal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const app = getCurrentInstance();

const categoryStore = useCategoryStore();
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const validationErrors = ref({});

const formData = ref({
  name: ""
});

const modalTitle = computed(() =>
  isEditing.value
    ? t("Views.Admin.ManageCategories.EditCategory")
    : t("Views.Admin.ManageCategories.AddCategory")
);

onMounted(async () => {
  await categoryStore.fetchCategories();
});

const validateForm = () => {
  const errors = {};

  if (!formData.value.name?.trim()) {
    errors.name = t("Views.Admin.ManageCategories.ValidationNameRequired");
  }

  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const resetForm = () => {
  formData.value = {
    name: ""
  };
  validationErrors.value = {};
};

const openAddModal = () => {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
  showModal.value = true;
};

const editCategory = (category) => {
  isEditing.value = true;
  editingId.value = category.categoryID;
  formData.value = {
    name: category.name
  };
  validationErrors.value = {};
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  const result = await categoryStore.upsertCategory({
    ...formData.value,
    categoryID: isEditing.value ? editingId.value : undefined
  });

  if (result.success) {
    alert(result.message);
    closeModal();
  } else {
    alert(result.message);
  }
};

const confirmDelete = async (category) => {
  if (
    confirm(
      t("Views.Admin.ManageCategories.DeleteConfirm", { name: category.name })
    )
  ) {
    const result = await categoryStore.deleteCategory(category.categoryID);
    app?.proxy.$notify(result.message, result.success ? "success" : "error");
  }
};
</script>

<style scoped>
.manage-category {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  margin: 0;
  color: var(--secondary-dark-color);
}

.categories-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-light-color);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background-color: var(--background-color);
  font-weight: 600;
  color: var(--secondary-dark-color);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  color: var(--text-light-color);
  transition: color 0.3s ease;
}

.btn-icon:hover {
  color: var(--primary-color);
}

.btn-icon.delete:hover {
  color: var(--danger-color);
}

.category-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input.error {
  border-color: var(--danger-color);
}

.error-message {
  color: var(--danger-color);
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--text-light-color);
}

.error {
  color: var(--danger-color);
  padding: 1rem;
  text-align: center;
  background: var(--danger-light-color);
  border-radius: 4px;
  margin: 1rem 0;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
