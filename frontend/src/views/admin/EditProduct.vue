<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Edit Product</h1>
        </div>
      </div>
    </header>

    <div class="form-container">
      <form class="admin-form" @submit.prevent="save">
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            id="name"
            v-model="product.name" 
            type="text"
            placeholder="Enter product name"
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description"
            v-model="product.description" 
            rows="3"
            placeholder="Enter product description"
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
            />
          </div>

          <div class="form-group">
            <label for="size">Sizes</label>
            <input 
              id="size"
              v-model="product.size" 
              type="text"
              placeholder="e.g. S-M-L-XL"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="price">Price</label>
            <input 
              id="price"
              v-model="product.price" 
              type="number"
              min="0"
              placeholder="Enter price"
            />
          </div>

          <div class="form-group">
            <label for="quantity">Quantity</label>
            <input 
              id="quantity"
              v-model="product.quantity" 
              type="number"
              min="0"
              placeholder="Enter quantity"
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
          <button type="submit" class="primary-btn">
            Save Changes
          </button>
          <RouterLink to="/admin/manage-product" class="secondary-btn">
            Cancel
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const previewImage = ref(null);
const newImage = ref(null);

const product = ref({
  name: "",
  description: "",
  color: "",
  size: "",
  price: "",
  quantity: "",
  linkImage: "",
});

const imagePreviewUrl = computed(() => {
  if (previewImage.value?.src) {
    return previewImage.value.src;
  }
  return product.value.linkImage 
    ? `http://localhost:5000/uploads/${product.value.linkImage}`
    : 'https://via.placeholder.com/200';
});

function uploadImage(e) {
  const file = e.target.files[0];
  if (file) {
    newImage.value = file;
    previewImage.value.src = URL.createObjectURL(file);
  }
}

async function save() {
  try {
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

    await axios.put(
      `http://localhost:5000/api/products/${route.params.productID}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    router.push("/admin/manage-product");
  } catch (error) {
    console.error("Error updating product:", error);
  }
}

onMounted(async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/products/${route.params.productID}`,
      { withCredentials: true }
    );
    product.value = response.data.data[0];
  } catch (error) {
    console.error("Error fetching product:", error);
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
</style>
