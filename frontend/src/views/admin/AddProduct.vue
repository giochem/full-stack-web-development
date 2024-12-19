<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>{{ $t("Views.Admin.AddProduct.Title") }}</h1>
        </div>
      </div>
    </header>

    <div class="form-container">
      <div v-if="loading" class="loading-state">
        <i class="ri-loader-4-line spinning"></i>
        {{ $t("Views.Admin.AddProduct.Loading") }}
      </div>
      <form v-else class="admin-form" @submit.prevent="handleSave">
        <div class="form-row">
          <div class="form-group">
            <label for="name">{{
              $t("Views.Admin.AddProduct.LabelProductName")
            }}</label>
            <input
              id="name"
              v-model="product.name"
              type="text"
              :placeholder="$t('Views.Admin.AddProduct.PlaceholderProductName')"
              :disabled="productStore.loading"
              required
            />
          </div>

          <div class="form-group">
            <label for="category">{{
              $t("Views.Admin.AddProduct.LabelCategory")
            }}</label>
            <select
              id="category"
              v-model="product.categoryID"
              required
              :disabled="productStore.loading"
            >
              <option value="">
                {{ $t("Views.Admin.AddProduct.PlaceholderCategory") }}
              </option>
              <option
                v-for="category in categories"
                :key="category.categoryID"
                :value="category.categoryID"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="description">{{
            $t("Views.Admin.AddProduct.LabelDescription")
          }}</label>
          <textarea
            id="description"
            v-model="product.description"
            rows="3"
            :placeholder="$t('Views.Admin.AddProduct.PlaceholderDescription')"
            :disabled="productStore.loading"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="promotion">{{
            $t("Views.Admin.AddProduct.LabelPromotion")
          }}</label>
          <select
            id="promotion"
            v-model="product.promotionID"
            :disabled="productStore.loading"
          >
            <option value="">
              {{ $t("Views.Admin.AddProduct.PlaceholderPromotion") }}
            </option>
            <option
              v-for="promotion in activePromotions"
              :key="promotion.promotionID"
              :value="promotion.promotionID"
            >
              {{ promotion.name }} ({{ promotion.discount }}% off)
            </option>
          </select>
          <small v-if="selectedPromotion" class="promotion-dates">
            {{ $t("Views.Admin.AddProduct.PromotionValidFrom") }}
            {{ formatDate(selectedPromotion.startDate) }}
            {{ $t("Views.Admin.AddProduct.PromotionValidTo") }}
            {{ formatDate(selectedPromotion.endDate) }}
          </small>
        </div>

        <div class="form-group">
          <label>{{ $t("Views.Admin.AddProduct.LabelMainImage") }}</label>
          <div class="image-upload">
            <input
              type="file"
              @change="uploadImage"
              accept="image/*"
              :disabled="productStore.loading"
            />
            <img
              ref="previewImage"
              :src="imagePreviewUrl"
              alt="Product preview"
              class="image-preview"
            />
          </div>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="primary-btn"
            :disabled="productStore.loading"
          >
            <i class="ri-save-line"></i>
            {{ $t("Views.Admin.AddProduct.ButtonAddProduct") }}
          </button>
          <RouterLink to="/admin/manage-product" class="secondary-btn">
            <i class="ri-arrow-left-line"></i>
            {{ $t("Views.Admin.AddProduct.ButtonCancel") }}
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "@/stores/product";
import { storeToRefs } from "pinia";
import { APP_CONSTANTS } from "@/utils/constants";

const app = getCurrentInstance();
const router = useRouter();
const productStore = useProductStore();
const previewImage = ref(null);
const newImage = ref(null);

// Get reactive refs from store
const { categories, promotions, loading } = storeToRefs(productStore);
const product = ref({
  name: "",
  description: "",
  categoryID: "",
  promotionID: ""
});

const activePromotions = computed(() => {
  const now = new Date();
  return promotions.value.filter((promo) => {
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);
    return startDate <= now && endDate >= now;
  });
});

const selectedPromotion = computed(() => {
  return promotions.value.find(
    (p) => p.promotionID === product.value.promotionID
  );
});

const imagePreviewUrl = computed(() => {
  if (previewImage.value?.src) {
    return previewImage.value.src;
  }
  return APP_CONSTANTS.UPLOAD.DEFAULT_IMAGE;
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function uploadImage(e) {
  const file = e.target.files[0];
  if (file) {
    newImage.value = file;
    previewImage.value.src = URL.createObjectURL(file);
  }
}

async function handleSave() {
  if (
    !product.value.name ||
    !product.value.description ||
    !product.value.categoryID
  ) {
    app?.proxy.$notify("Please fill in all required fields", "warning");
    return;
  }

  const formData = new FormData();
  formData.append("name", product.value.name);
  formData.append("description", product.value.description);
  formData.append("categoryID", product.value.categoryID);
  if (product.value.promotionID) {
    formData.append("promotionID", product.value.promotionID);
  }
  if (newImage.value) {
    formData.append("file", newImage.value);
  }

  const result = await productStore.createProduct(formData);
  if (result.success) {
    app?.proxy.$notify(result.message, "success");
    router.push("/admin/manage-product");
  } else {
    app?.proxy.$notify(result.message, "error");
  }
}

// Update onMounted to use store action
onMounted(async () => {
  const result = await productStore.fetchExtraInfo();
  if (!result.success) {
    app?.proxy.$notify(result.message, "error");
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
  max-width: 800px;
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

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-group input:disabled,
.form-group textarea:disabled {
  background-color: var(--light-bg-color);
  cursor: not-allowed;
}

.image-upload {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-preview {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--border-color);
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
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}

.promotion-dates {
  display: block;
  color: var(--text-light-color);
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  width: 100%;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: var(--primary-color);
}

select:disabled {
  background-color: var(--light-bg-color);
  cursor: not-allowed;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  color: var(--text-light-color);
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
</style>
