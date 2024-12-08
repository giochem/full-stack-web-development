<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Edit Product</h1>
        </div>
        <div class="header-actions">
          <RouterLink to="/admin/manage-variations" class="variation-btn">
            <i class="ri-list-settings-line"></i>
            Manage Variations
          </RouterLink>
        </div>
      </div>
    </header>

    <div class="form-container">
      <div v-if="productStore.loading" class="loading-state">
        <i class="ri-loader-4-line spinning"></i> Loading...
      </div>
      <form v-else class="admin-form">
        <!-- Top: Basic Information -->
        <div class="form-section">
          <h2 class="section-title">Basic Information</h2>

          <!-- Three columns in one row -->
          <div class="form-row three-columns">
            <div class="form-group">
              <label for="name">Product Name</label>
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
              <label for="category">Category</label>
              <div class="select-wrapper">
                <select
                  id="category"
                  v-model="product.categoryID"
                  required
                  :disabled="productStore.loading"
                >
                  <option value="">Select Category</option>
                  <option
                    v-for="category in productStore.categories"
                    :key="category.categoryID"
                    :value="category.categoryID"
                  >
                    {{ category.name }}
                  </option>
                </select>
                <i class="ri-arrow-down-s-line select-arrow"></i>
              </div>
            </div>

            <div class="form-group">
              <label for="promotion">Promotion (Optional)</label>
              <div class="select-wrapper">
                <select
                  id="promotion"
                  v-model="product.promotionID"
                  :disabled="productStore.loading"
                >
                  <option value="">No Promotion</option>
                  <option
                    v-for="promotion in productStore.promotions"
                    :key="promotion.promotionID"
                    :value="promotion.promotionID"
                    :class="getPromotionStatusClass(promotion)"
                  >
                    {{ promotion.name }}
                    <span class="promotion-status">{{
                      getPromotionStatus(promotion)
                    }}</span>
                    <span class="promotion-discount"
                      >({{ promotion.discount }}% off)</span
                    >
                  </option>
                </select>
                <i class="ri-arrow-down-s-line select-arrow"></i>
              </div>
              <small v-if="selectedPromotion" class="promotion-dates">
                {{ formatDate(selectedPromotion.startDate) }} -
                {{ formatDate(selectedPromotion.endDate) }}
                <span
                  :class="[
                    'status-badge',
                    getPromotionStatusClass(selectedPromotion),
                  ]"
                >
                  {{ getPromotionStatus(selectedPromotion) }}
                </span>
              </small>
            </div>
          </div>

          <!-- Description in its own row -->
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

          <div class="form-group">
            <label>Main Product Image</label>
            <div class="image-upload">
              <input
                type="file"
                @change="uploadMainImage"
                accept="image/*"
                :disabled="productStore.loading"
              />
              <img
                ref="mainImagePreview"
                :src="getImageUrl(product.image)"
                alt="Product preview"
                class="image-preview"
              />
            </div>
          </div>

          <!-- Form actions right after basic info -->
          <div class="form-actions">
            <button
              type="submit"
              class="primary-btn"
              :disabled="productStore.loading"
              @click.prevent="handleSave"
            >
              <i class="ri-save-line"></i> Save Basic Info
            </button>
            <RouterLink to="/admin/manage-product" class="secondary-btn">
              <i class="ri-arrow-left-line"></i> Cancel
            </RouterLink>
          </div>
        </div>

        <!-- Bottom: Product Items -->
        <div class="form-section product-items-section">
          <div class="section-header">
            <h2 class="section-title">Product Items</h2>
            <small class="section-hint">
              Each product item can have multiple attributes
            </small>
          </div>

          <div class="product-items-grid">
            <div
              v-for="(item, index) in productStore.currentProductItems"
              :key="item.productItemID"
              class="product-item"
            >
              <div class="item-header">
                <h3>Product Item #{{ index + 1 }}</h3>
                <div class="item-actions">
                  <button
                    type="button"
                    class="save-item-btn"
                    @click="saveProductItem(index)"
                    :disabled="!productStore.isItemModified(index)"
                  >
                    <i class="ri-save-line"></i> Save Item
                  </button>
                  <button
                    type="button"
                    class="delete-btn"
                    @click="productStore.removeProductItem(index)"
                  >
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>

              <!-- Basic item info -->
              <div class="form-row">
                <div class="form-group">
                  <label :for="'sku-' + index">SKU</label>
                  <input
                    :id="'sku-' + index"
                    v-model="item.sku"
                    type="text"
                    placeholder="Enter SKU"
                    required
                  />
                </div>

                <div class="form-group">
                  <label :for="'price-' + index">Price</label>
                  <input
                    :id="'price-' + index"
                    v-model.number="item.price"
                    type="number"
                    min="0"
                    placeholder="Enter price"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label :for="'quantity-' + index">Quantity</label>
                <input
                  :id="'quantity-' + index"
                  v-model.number="item.quantity"
                  type="number"
                  min="0"
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <!-- Attributes section -->
              <div class="attributes-section">
                <div class="attributes-header">
                  <h4>Attributes</h4>
                  <button
                    type="button"
                    class="add-attribute-btn"
                    @click="productStore.addAttribute(index)"
                    :disabled="!productStore.hasAvailableVariations(index)"
                  >
                    <i class="ri-add-line"></i> Add Attribute
                  </button>
                </div>

                <div
                  v-for="(attr, attrIndex) in item.attributes"
                  :key="attrIndex"
                  class="attribute-row"
                >
                  <div class="form-row">
                    <div class="form-group">
                      <label :for="'attr-name-' + index + '-' + attrIndex"
                        >Attribute Name</label
                      >
                      <select
                        :id="'attr-name-' + index + '-' + attrIndex"
                        v-model="attr.variationID"
                        required
                        class="attribute-select"
                        @change="
                          productStore.handleVariationChange(
                            $event,
                            index,
                            attrIndex
                          )
                        "
                      >
                        <option value="" disabled>Select Attribute</option>
                        <option
                          v-for="variation in productStore.availableVariations(
                            index,
                            attrIndex
                          )"
                          :key="variation.variationID"
                          :value="variation.variationID"
                        >
                          {{ variation.name }}
                        </option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label :for="'attr-value-' + index + '-' + attrIndex"
                        >Value</label
                      >
                      <input
                        :id="'attr-value-' + index + '-' + attrIndex"
                        v-model="attr.value"
                        type="text"
                        :placeholder="`Enter ${
                          attr.nameAtribute || 'attribute'
                        } value`"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    class="remove-attribute-btn"
                    @click="productStore.removeAttribute(index, attrIndex)"
                  >
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>

                <div
                  v-if="!productStore.hasAvailableVariations(index)"
                  class="no-variations-hint"
                >
                  All available attributes have been added
                </div>
              </div>

              <!-- Item image -->
              <div class="form-group">
                <label>Product Item Image</label>
                <div class="image-upload">
                  <input
                    type="file"
                    @change="(e) => uploadItemImage(e, index)"
                    accept="image/*"
                  />
                  <img
                    :src="getImageUrl(item.image)"
                    :alt="'Product Item ' + (index + 1)"
                    class="image-preview"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="add-item-container">
            <button
              type="button"
              class="add-item-btn"
              @click="productStore.addProductItem"
            >
              <i class="ri-add-line"></i> Add Product Item
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "@/stores/product";
import { useVariationStore } from '@/stores/variation';
import { getCurrentInstance } from "vue";
import { APP_CONSTANTS } from "@/utils/constants";
import axios from "axios";
import { storeToRefs } from "pinia";

const app = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const variationStore = useVariationStore();
const mainImageFile = ref(null);

const product = ref({
  name: "",
  description: "",
  categoryID: null,
  promotionID: null,
  image: "",
});

// Get reactive refs from store
const { currentProductItems, loading, variations } = storeToRefs(productStore);

function getImageUrl(image) {
  if (!image) return APP_CONSTANTS.UPLOAD.DEFAULT_IMAGE;
  return /^https?:\/\//i.test(image)
    ? image
    : `${APP_CONSTANTS.UPLOAD.UPLOAD_URL}${image}`;
}

function uploadMainImage(e) {
  const file = e.target.files[0];
  if (file) {
    mainImageFile.value = file;
    product.value.image = URL.createObjectURL(file);
  }
}

function uploadItemImage(e, index) {
  const file = e.target.files[0];
  if (file) {
    currentProductItems.value[index].newImage = file;
    currentProductItems.value[index].image = URL.createObjectURL(file);
    productStore.modifiedItems.add(index);
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
  // Add basic product info
  formData.append("productID", product.value.productID);
  formData.append("name", product.value.name);
  formData.append("description", product.value.description);
  formData.append("categoryID", product.value.categoryID);
  formData.append("image", product.value.image);
  if (product.value.promotionID) {
    formData.append("promotionID", product.value.promotionID);
  }
  if (mainImageFile.value) {
    formData.append("file", mainImageFile.value);
  }

  // Add product items
  // formData.append("productItems", JSON.stringify(productItems.value));
  // formData.append("deletedItemIds", JSON.stringify(deletedItemIds.value));

  // Add variation images
  // productItems.value.forEach((item, index) => {
  //   if (item.newImage) {
  //     formData.append(`variationImage${index}`, item.newImage);
  //   }
  // });

  const result = await productStore.updateProduct(
    route.params.productID,
    formData
  );
  if (result.success) {
    app?.proxy.$notify(result.message, "success");
    router.push("/admin/manage-product");
  } else {
    app?.proxy.$notify(result.message, "error");
  }
}

onMounted(async () => {
  await Promise.all([
    productStore.fetchExtraInfo(),
    variationStore.fetchVariations()
  ]);

  const result = await productStore.fetchProductById(route.params.productID);
  if (result.success) {
    const [productData, productItemsData] = result.data;
    product.value = {
      ...productData,
      promotionID: productData.promotionID || null,
    };

    // Restructure product items data
    const groupedItems = {};
    productItemsData.forEach((item) => {
      if (!groupedItems[item.productItemID]) {
        groupedItems[item.productItemID] = {
          productItemID: item.productItemID,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          attributes: [],
        };
      }
      groupedItems[item.productItemID].attributes.push({
        variationID: item.variationID,
        nameAtribute: item.nameAtribute,
        value: item.value,
      });
    });

    productStore.setCurrentProductItems(Object.values(groupedItems));
  } else {
    app?.proxy.$notify(result.message, "error");
    router.push("/admin/manage-product");
  }
});

const selectedPromotion = computed(() => {
  return productStore.promotions.find(
    (p) => p.promotionID === product.value.promotionID
  );
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function saveProductItem(index) {
  const item = currentProductItems.value[index];
  if (!item.sku || !item.price || !item.quantity) {
    app?.proxy.$notify(
      "Please fill in all required fields for this item",
      "warning"
    );
    return;
  }

  const result = await productStore.updateProductItem({
    ...item,
    productID: product.value.productID,
  });

  if (result.success) {
    app?.proxy.$notify(result.message, "success");
  } else {
    app?.proxy.$notify(result.message, "error");
  }
}

watch(
  currentProductItems,
  (items) => {
    items.forEach((_, index) => {
      watch(
        () => items[index],
        () => {
          productStore.modifiedItems.add(index);
        },
        { deep: true }
      );
    });
  },
  { deep: true }
);

function getPromotionStatus(promotion) {
  const now = new Date();
  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);

  if (now < startDate) {
    return "Coming Soon";
  } else if (now > endDate) {
    return "Expired";
  } else {
    return "Active";
  }
}

function getPromotionStatusClass(promotion) {
  const status = getPromotionStatus(promotion);
  return {
    "status-expired": status === "Expired",
    "status-active": status === "Active",
    "status-coming": status === "Coming Soon",
  };
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-title {
  text-align: center;
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

.variation-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.variation-btn:hover {
  background: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.2);
}

.variation-btn i {
  font-size: 1.1rem;
}

.form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  margin-top: 1rem;
}

.form-actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
  }

  .variation-btn {
    width: 100%;
    justify-content: center;
  }
}

.form-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid var(--border-color);
}

.section-title {
  font-size: 1.25rem;
  color: var(--secondary-dark-color);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.product-item {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--light-bg-color);
}

.item-header h3 {
  font-size: 1.2rem;
  color: var(--secondary-dark-color);
  margin: 0;
}

.item-actions {
  display: flex;
  gap: 0.75rem;
}

.save-item-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  position: relative;
}

.save-item-btn:hover:not(:disabled) {
  background: var(--secondary-color);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.2);
}

.save-item-btn:disabled {
  background: rgba(var(--text-light-color-rgb), 0.1);
  cursor: not-allowed;
  border: 1px solid rgba(var(--text-light-color-rgb), 0.2);
  color: rgba(var(--text-color-rgb), 0.5);
  backdrop-filter: blur(2px);
}

.save-item-btn:disabled i {
  opacity: 0.5;
}

.add-item-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;
}

.add-item-btn:hover {
  background: var(--primary-color);
  transform: translateY(-1px);
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

.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper select {
  width: 100%;
  padding: 0.75rem;
  padding-right: 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  appearance: none;
  -webkit-appearance: none;
  font-size: 1rem;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-wrapper select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.1);
}

.select-wrapper select:disabled {
  background-color: var(--light-bg-color);
  cursor: not-allowed;
  opacity: 0.7;
}

.select-arrow {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light-color);
  pointer-events: none;
  font-size: 1.25rem;
}

.select-wrapper:hover select:not(:disabled) {
  border-color: var(--primary-color);
}

.promotion-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.promotion-discount {
  color: var(--primary-color);
  font-weight: 500;
  margin-left: 0.5rem;
}

.promotion-dates {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  color: var(--text-light-color);
  font-size: 0.875rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.section-hint {
  color: var(--text-light-color);
  font-style: italic;
}

.promotion-status {
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
}

.status-expired {
  color: #dc3545;
  background-color: rgba(220, 53, 69, 0.1);
}

.status-active {
  color: #198754;
  background-color: rgba(25, 135, 84, 0.1);
}

.status-coming {
  color: #0d6efd;
  background-color: rgba(13, 110, 253, 0.1);
}

.select-wrapper select option {
  padding: 0.75rem;
}

.select-wrapper select option[class*="status-"] {
  position: relative;
  padding-right: 100px; /* Space for status */
}

.attributes-section {
  background: var(--light-bg-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.attributes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.attributes-header h4 {
  margin: 0;
  color: var(--secondary-dark-color);
  font-size: 1rem;
}

.add-attribute-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.add-attribute-btn:hover {
  background: var(--primary-color);
}

.attribute-row {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  position: relative;
  border: 1px solid var(--border-color);
}

.attribute-row:last-child {
  margin-bottom: 0;
}

.remove-attribute-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem;
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.remove-attribute-btn:hover {
  opacity: 1;
}

.attribute-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  font-size: 1rem;
  color: var(--text-color);
  cursor: pointer;
}

.attribute-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.no-variations-hint {
  color: var(--text-light-color);
  font-size: 0.875rem;
  font-style: italic;
  text-align: center;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  margin-top: 0.5rem;
}

.add-attribute-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--text-light-color);
}

/* Add new layout styles */
.form-layout {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns */
  gap: 2rem;
  align-items: start; /* Prevents stretching */
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Add responsive styles */
@media (max-width: 1200px) {
  .form-layout {
    grid-template-columns: 1fr; /* Stack columns on smaller screens */
  }

  .form-container {
    padding: 1rem;
  }
}

/* Update product items grid styles */
.product-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.product-item {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

/* Center the Add Product Item button */
.add-item-container {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.add-item-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.add-item-btn:hover {
  background: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.2);
}

/* Update responsive styles */
@media (max-width: 768px) {
  .product-items-grid {
    grid-template-columns: 1fr;
  }

  .product-item {
    padding: 1.5rem;
  }

  .item-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    text-align: center;
  }

  .item-actions {
    justify-content: center;
  }
}

/* Add specific styles for product items section */
.product-items-section {
  background: white;
  border-radius: 8px;
}

/* Update responsive styles */
@media (max-width: 768px) {
  .form-container {
    padding: 1rem;
  }

  .form-section {
    padding: 1.5rem;
  }
}

/* Update image upload section */
.image-upload {
  background: var(--light-bg-color);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.image-preview {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  margin-top: 1rem;
}

/* Update form inputs within product item */
.product-item .form-group input,
.product-item .form-group select {
  background: white;
  border: 1px solid var(--border-color);
  padding: 0.75rem;
  border-radius: 6px;
  width: 100%;
}

.product-item .form-group input:focus,
.product-item .form-group select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.1);
}

/* Add styles for three-column layout */
.form-row.three-columns {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group input,
.form-group .select-wrapper select {
  height: 42px; /* Consistent height for inputs and selects */
}

/* Update responsive styles */
@media (max-width: 1024px) {
  .form-row.three-columns {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .form-row.three-columns {
    grid-template-columns: 1fr;
  }
}

/* Ensure consistent heights */
.select-wrapper {
  height: 42px;
}

.select-wrapper select {
  height: 100%;
  padding: 0 2.5rem 0 0.75rem;
}

/* Add margin below promotion dates */
.promotion-dates {
  margin-top: 0.5rem;
  margin-bottom: 0;
}

/* Add these CSS variables to your root/global styles */
:root {
  --text-light-color-rgb: 108, 117, 125;  /* RGB values for your text light color */
  --text-color-rgb: 33, 37, 41;           /* RGB values for your text color */
}
</style>
