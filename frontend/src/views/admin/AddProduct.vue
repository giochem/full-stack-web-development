<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Add Product</h1>
        </div>
      </div>
    </header>

    <div class="form-container">
      <form class="admin-form" @submit.prevent="handleSave">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="product.name"
            type="text"
            placeholder="Enter product name"
            :disabled="productStore.loading"
            required
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="product.description"
            rows="3"
            placeholder="Enter product description"
            :disabled="productStore.loading"
            required
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="color">Colors</label>
            <input
              id="color"
              v-model="product.color"
              type="text"
              placeholder="e.g. Red-Blue-Green"
              :disabled="productStore.loading"
              required
            />
          </div>

          <div class="form-group">
            <label for="size">Sizes</label>
            <input
              id="size"
              v-model="product.size"
              type="text"
              placeholder="e.g. S-M-L-XL"
              :disabled="productStore.loading"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="price">Price</label>
            <input
              id="price"
              v-model.number="product.price"
              type="number"
              min="0"
              placeholder="Enter price"
              :disabled="productStore.loading"
              required
            />
          </div>

          <div class="form-group">
            <label for="quantity">Quantity</label>
            <input
              id="quantity"
              v-model.number="product.quantity"
              type="number"
              min="0"
              placeholder="Enter quantity"
              :disabled="productStore.loading"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="image">Product Image</label>
          <div class="image-upload">
            <input
              id="image"
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
            Add Product
          </button>
          <RouterLink
            to="/admin/manage-product"
            class="secondary-btn"
            :class="{ disabled: productStore.loading }"
          >
            Cancel
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "@/stores/product";

const app = getCurrentInstance();
const router = useRouter();
const productStore = useProductStore();
const previewImage = ref(null);
const newImage = ref(null);

const product = ref({
  name: "",
  description: "",
  color: "",
  size: "",
  price: "",
  quantity: "",
});

const imagePreviewUrl = computed(() => {
  if (previewImage.value?.src) {
    return previewImage.value.src;
  }
  return "https://via.placeholder.com/200";
});

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
    product.value.price <= 0 ||
    product.value.quantity < 0
  ) {
    app?.proxy.$notify(
      "Please fill in all required fields correctly",
      "warning"
    );
    return;
  }

  const formData = new FormData();
  formData.append("name", product.value.name);
  formData.append("description", product.value.description);
  formData.append("color", product.value.color);
  formData.append("size", product.value.size);
  formData.append("price", product.value.price);
  formData.append("quantity", product.value.quantity);
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
</style>
