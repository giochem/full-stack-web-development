<template>
  <div class="manage-promotion">
    <div class="header">
      <h2>{{ $t("Views.Admin.ManagePromotions.Title") }}</h2>
      <button class="btn-primary" @click="openAddModal">
        <i class="ri-add-line"></i>
        {{ $t("Views.Admin.ManagePromotions.AddPromotion") }}
      </button>
    </div>

    <div v-if="promotionStore.loading" class="loading">
      <i class="ri-loader-4-line spin"></i>
      {{ $t("Views.Admin.ManagePromotions.Loading") }}
    </div>

    <div v-else-if="promotionStore.error" class="error">
      {{ promotionStore.error }}
    </div>

    <div v-else-if="!promotionStore.promotions.length" class="empty-state">
      <i class="ri-inbox-line"></i>
      <p>{{ $t("Views.Admin.ManagePromotions.NoPromotions") }}</p>
    </div>

    <div v-else class="promotions-list">
      <table>
        <thead>
          <tr>
            <th>{{ $t("Views.Admin.ManagePromotions.PromotionName") }}</th>
            <th>{{ $t("Views.Admin.ManagePromotions.Discount") }}</th>
            <th>{{ $t("Views.Admin.ManagePromotions.StartDate") }}</th>
            <th>{{ $t("Views.Admin.ManagePromotions.EndDate") }}</th>
            <th>{{ $t("Views.Admin.ManagePromotions.Status") }}</th>
            <th>{{ $t("Views.Admin.ManagePromotions.Actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="promotion in promotionStore.promotions"
            :key="promotion.promotionID"
          >
            <td>{{ promotion.name }}</td>
            <td>{{ promotion.discount }}%</td>
            <td>{{ formatDate(promotion.startDate) }}</td>
            <td>{{ formatDate(promotion.endDate) }}</td>
            <td>
              <span :class="['status-badge', getPromotionStatus(promotion)]">
                {{ getPromotionStatus(promotion) }}
              </span>
            </td>
            <td class="actions">
              <button
                class="btn-icon"
                @click="editPromotion(promotion)"
                title="Edit"
              >
                <i class="ri-edit-line"></i>
              </button>
              <button
                class="btn-icon delete"
                @click="confirmDelete(promotion)"
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
      <form @submit.prevent="handleSubmit" class="promotion-form">
        <div class="form-group">
          <label for="name">{{
            $t("Views.Admin.ManagePromotions.PromotionName")
          }}</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            :placeholder="
              $t('Views.Admin.ManagePromotions.PlaceholderPromotionName')
            "
            :class="{ error: validationErrors.name }"
          />
          <span v-if="validationErrors.name" class="error-message">
            {{ validationErrors.name }}
          </span>
        </div>

        <div class="form-group">
          <label for="discount">{{
            $t("Views.Admin.ManagePromotions.Discount")
          }}</label>
          <input
            id="discount"
            v-model.number="formData.discount"
            type="number"
            required
            min="0"
            max="100"
            :placeholder="
              $t('Views.Admin.ManagePromotions.PlaceholderDiscount')
            "
            :class="{ error: validationErrors.discount }"
          />
          <span v-if="validationErrors.discount" class="error-message">
            {{ validationErrors.discount }}
          </span>
        </div>

        <div class="form-group">
          <label for="startDate">{{
            $t("Views.Admin.ManagePromotions.StartDate")
          }}</label>
          <input
            id="startDate"
            v-model="formData.startDate"
            type="date"
            required
            :min="formatDateForInput(new Date())"
            @change="handleStartDateChange"
            :class="{ error: validationErrors.startDate }"
          />
          <span v-if="validationErrors.startDate" class="error-message">
            {{ validationErrors.startDate }}
          </span>
        </div>

        <div class="form-group">
          <label for="endDate">{{
            $t("Views.Admin.ManagePromotions.EndDate")
          }}</label>
          <input
            id="endDate"
            v-model="formData.endDate"
            type="date"
            required
            :min="formData.startDate"
            :class="{ error: validationErrors.endDate }"
          />
          <span v-if="validationErrors.endDate" class="error-message">
            {{ validationErrors.endDate }}
          </span>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="closeModal">
            {{ $t("Views.Admin.ManagePromotions.Cancel") }}
          </button>
          <button
            type="submit"
            class="btn-primary"
            :disabled="promotionStore.loading"
          >
            <i v-if="promotionStore.loading" class="ri-loader-4-line spin"></i>
            {{
              isEditing
                ? $t("Views.Admin.ManagePromotions.Update")
                : $t("Views.Admin.ManagePromotions.Create")
            }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from "vue";
import { usePromotionStore } from "@/stores/promotion";
import Modal from "@/components/common/Modal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const app = getCurrentInstance();
const promotionStore = usePromotionStore();
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const validationErrors = ref({});

const formData = ref({
  name: "",
  discount: 0,
  startDate: "",
  endDate: ""
});

const modalTitle = computed(() =>
  isEditing.value
    ? t("Views.Admin.ManagePromotions.EditPromotion")
    : t("Views.Admin.ManagePromotions.AddPromotion")
);

onMounted(async () => {
  await promotionStore.fetchPromotions();
});

const validateForm = () => {
  const errors = {};

  if (!formData.value.name?.trim()) {
    errors.name = t("Views.Admin.ManagePromotions.ValidationNameRequired");
  }

  if (
    !formData.value.discount ||
    formData.value.discount < 0 ||
    formData.value.discount > 100
  ) {
    errors.discount = t("Views.Admin.ManagePromotions.ValidationDiscountRange");
  }

  if (!formData.value.startDate) {
    errors.startDate = t(
      "Views.Admin.ManagePromotions.ValidationStartDateRequired"
    );
  }

  if (!formData.value.endDate) {
    errors.endDate = t(
      "Views.Admin.ManagePromotions.ValidationEndDateRequired"
    );
  }

  if (formData.value.startDate && formData.value.endDate) {
    const start = new Date(formData.value.startDate);
    const end = new Date(formData.value.endDate);
    if (start >= end) {
      errors.endDate = t(
        "Views.Admin.ManagePromotions.ValidationEndDateAfterStart"
      );
    }
  }

  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const getPromotionStatus = (promotion) => {
  const now = new Date();
  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);

  if (now < startDate) return "upcoming";
  if (now > endDate) return "expired";
  return "active";
};

const handleStartDateChange = (e) => {
  formData.value.startDate = e.target.value;
  if (new Date(formData.value.endDate) <= new Date(formData.value.startDate)) {
    formData.value.endDate = formData.value.startDate;
  }
  validateForm();
};

const resetForm = () => {
  formData.value = {
    name: "",
    discount: 0,
    startDate: formatDateForInput(new Date()),
    endDate: formatDateForInput(
      new Date(new Date().setDate(new Date().getDate() + 30))
    )
  };
  validationErrors.value = {};
};

const openAddModal = () => {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
  showModal.value = true;
};

const editPromotion = (promotion) => {
  isEditing.value = true;
  editingId.value = promotion.promotionID;
  formData.value = {
    name: promotion.name,
    discount: promotion.discount,
    startDate: formatDateForInput(promotion.startDate),
    endDate: formatDateForInput(promotion.endDate)
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

  const result = await promotionStore.upsertPromotion({
    ...formData.value,
    promotionID: isEditing.value ? editingId.value : undefined
  });

  if (result.success) {
    alert(result.message);
    closeModal();
  } else {
    alert(result.message);
  }
};

const confirmDelete = async (promotion) => {
  if (
    confirm(
      t("Views.Admin.ManagePromotions.DeleteConfirm", { name: promotion.name })
    )
  ) {
    const result = await promotionStore.deletePromotion(promotion.promotionID);
    app?.proxy.$notify(result.message, result.success ? "success" : "error");
  }
};
</script>

<style scoped>
.manage-promotion {
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

.promotions-list {
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

.promotion-form {
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

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.active {
  background-color: var(--success-light-color);
  color: var(--success-color);
}

.status-badge.upcoming {
  background-color: var(--primary-light-color);
  color: var(--primary-color);
}

.status-badge.expired {
  background-color: var(--danger-light-color);
  color: var(--danger-color);
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
