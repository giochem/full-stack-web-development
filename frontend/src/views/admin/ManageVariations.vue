<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Manage Variations</h1>
        </div>
        <div class="header-actions">
          <button class="add-btn" @click="handleAdd">
            <i class="ri-add-line"></i>
            Add Variation
          </button>
        </div>
      </div>
    </header>

    <!-- Variations list -->
    <div class="variations-list">
      <div v-if="loading" class="loading-state">
        <i class="ri-loader-4-line spinning"></i> Loading variations...
      </div>
      <div v-else-if="variations.length === 0" class="empty-state">
        <i class="ri-file-list-3-line"></i>
        <p>No variations found</p>
      </div>
      <div v-else class="variations-grid">
        <div
          v-for="variation in variations"
          :key="variation.variationID"
          class="variation-card"
        >
          <div class="variation-content">
            <h3>{{ variation.name }}</h3>
          </div>
          <div class="variation-actions">
            <button class="edit-btn" @click="handleEdit(variation)">
              <i class="ri-edit-line"></i>
              Edit
            </button>
            <button
              class="delete-btn"
              @click="handleDelete(variation.variationID)"
            >
              <i class="ri-delete-bin-line"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal
      v-model="showModal"
      :title="isEditing ? 'Edit Variation' : 'Add Variation'"
    >
      <form @submit.prevent="handleSubmit" class="variation-form">
        <div class="form-group">
          <label for="nameAtribute">Variation Name</label>
          <input
            id="nameAtribute"
            v-model="form.nameAtribute"
            type="text"
            placeholder="e.g. Size, Color, Material"
            required
            :disabled="loading"
            ref="inputRef"
            @input="validateInput"
          />
          <small
            >Enter a name for the variation attribute (e.g. Size, Color,
            Material)</small
          >
          <span v-if="errorMessage" class="error-message">{{
            errorMessage
          }}</span>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="submit-btn"
            :disabled="loading || !!errorMessage"
          >
            <i class="ri-save-line"></i>
            {{ isEditing ? "Update" : "Create" }}
          </button>
          <button
            type="button"
            class="cancel-btn"
            @click="closeModal"
            :disabled="loading"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, getCurrentInstance } from "vue";
import { useVariationStore } from "@/stores/variation";
import { storeToRefs } from "pinia";
import Modal from "@/components/common/Modal.vue";

const app = getCurrentInstance();
const variationStore = useVariationStore();
const { variations, loading } = storeToRefs(variationStore);

const showModal = ref(false);
const isEditing = ref(false);
const selectedVariation = ref(null);
const inputRef = ref(null);
const errorMessage = ref("");

const form = ref({
  nameAtribute: "",
});

function validateInput(e) {
  const value = e.target.value;
  if (value.length < 2) {
    errorMessage.value = "Name must be at least 2 characters long";
  } else if (value.length > 50) {
    errorMessage.value = "Name must be less than 50 characters";
  } else {
    errorMessage.value = "";
  }
}

function handleAdd() {
  isEditing.value = false;
  selectedVariation.value = null;
  form.value.nameAtribute = "";
  showModal.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
}

function handleEdit(variation) {
  isEditing.value = true;
  selectedVariation.value = variation;
  form.value.nameAtribute = variation.name;
  showModal.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
}

async function handleDelete(variationID) {
  if (confirm("Functionality is not implemented yet")) {
    // const result = await variationStore.deleteVariation(variationID);
    // if (result.success) {
    //   app?.proxy.$notify(result.message, "success");
    // } else {
    //   app?.proxy.$notify(result.message, "error");
    // }
  }
}

function closeModal() {
  showModal.value = false;
  isEditing.value = false;
  selectedVariation.value = null;
  form.value.nameAtribute = "";
  errorMessage.value = "";
}

async function handleSubmit() {
  try {
    const result = await variationStore.upsertVariation({
      variationID: selectedVariation.value?.variationID,
      nameAtribute: form.value.nameAtribute,
    });

    if (result.success) {
      app?.proxy.$notify(result.message, "success");
      closeModal();
    } else {
      app?.proxy.$notify(result.message, "error");
    }
  } catch (error) {
    console.error("Error saving variation:", error);
    app?.proxy.$notify("An error occurred while saving the variation", "error");
  }
}

onMounted(async () => {
  await variationStore.fetchVariations();
});
</script>

<style scoped>
.admin-page {
  padding: 1.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-title h1 {
  font-size: 1.5rem;
  color: var(--secondary-dark-color);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.add-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.2);
}

/* Add responsive styles */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-actions {
    width: 100%;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
  }
}

.variations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.variation-card {
  background: white;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.3s ease;
}

.variation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.variation-content {
  padding: 1.5rem;
}

.variation-content h3 {
  margin: 0;
  color: var(--secondary-dark-color);
  font-size: 1.1rem;
}

.variation-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--light-bg-color);
  border-top: 1px solid var(--border-color);
}

.edit-btn,
.delete-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.edit-btn {
  background: var(--secondary-color);
  color: white;
}

.edit-btn:hover {
  background: var(--primary-color);
}

.delete-btn {
  background: white;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
}

.delete-btn:hover {
  background: var(--danger-color);
  color: white;
}

.variation-form {
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
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-group small {
  color: var(--text-light-color);
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-btn,
.cancel-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.submit-btn {
  background: var(--primary-color);
  color: white;
  border: none;
}

.submit-btn:hover:not(:disabled) {
  background: var(--secondary-color);
}

.cancel-btn {
  background: white;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.cancel-btn:hover:not(:disabled) {
  background: var(--light-bg-color);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-light-color);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.spinning {
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

/* Add error message styling */
.error-message {
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-group input.error {
  border-color: var(--danger-color);
}

/* Add focus styles */
.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.1);
}
</style>
