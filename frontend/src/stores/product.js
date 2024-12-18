import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/constants";

// Constants for messages
const MESSAGE = {
  SUCCESS_GET_PRODUCTS: "Successfully retrieved products",
  SUCCESS_GET_PRODUCT: "Successfully retrieved product",
  SUCCESS_CREATE_PRODUCT: "Successfully created product",
  SUCCESS_UPDATE_PRODUCT: "Successfully updated product",
  SUCCESS_DELETE_PRODUCT: "Successfully deleted product",
  ERROR_GET_PRODUCTS: "Failed to fetch products",
  ERROR_GET_PRODUCT: "Failed to fetch product",
  ERROR_CREATE_PRODUCT: "Failed to create product",
  ERROR_UPDATE_PRODUCT: "Failed to update product",
  ERROR_DELETE_PRODUCT: "Failed to delete product"
};

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    hasNextPage: true,
    categories: [],
    promotions: [],
    currentProductItems: [],
    modifiedItems: new Set(),
    deletedItemIds: []
  }),

  actions: {
    async fetchProducts(page = 0, size = 12, filters = {}) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios[
          API_ENDPOINTS.PRODUCTS.LIST.method.toLowerCase()
        ](API_ENDPOINTS.PRODUCTS.LIST.url(page, size, filters));

        this.products = response.data.data;
        this.hasNextPage = this.products.length >= size;

        return {
          success: response.data.success,
          message: response.data.message || MESSAGE.SUCCESS_GET_PRODUCTS,
          data: this.products
        };
      } catch (error) {
        console.error("Error fetching products:", error);
        const errorMessage = this.getErrorMessage(error);
        this.error = errorMessage;
        return {
          success: false,
          message: errorMessage
        };
      } finally {
        this.loading = false;
      }
    },

    async fetchProductById(productId) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios[
          API_ENDPOINTS.PRODUCTS.DETAIL.method.toLowerCase()
        ](API_ENDPOINTS.PRODUCTS.DETAIL.url(productId));

        this.currentProduct = [response.data.data[0][0], response.data.data[1]];
        return {
          success: response.data.success,
          message: response.data.message || MESSAGE.SUCCESS_GET_PRODUCT,
          data: this.currentProduct
        };
      } catch (error) {
        console.error("Error fetching product:", error);
        const errorMessage = this.getErrorMessage(error);
        this.error = errorMessage;
        return {
          success: false,
          message: errorMessage
        };
      } finally {
        this.loading = false;
      }
    },
    async createProduct(productData) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios[
          API_ENDPOINTS.PRODUCTS.UPSERT.method.toLowerCase()
        ](API_ENDPOINTS.PRODUCTS.UPSERT.url, productData, {
          headers: {
            "Content-Type": "multipart/form-data" // For image upload
          }
        });

        return {
          success: response.data.success,
          message: response.data.message || MESSAGE.SUCCESS_CREATE_PRODUCT,
          data: response.data.data
        };
      } catch (error) {
        console.error("Error creating product:", error);
        const errorMessage = this.getErrorMessage(error);
        this.error = errorMessage;
        return {
          success: false,
          message: errorMessage
        };
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(productId, productData) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios[
          API_ENDPOINTS.PRODUCTS.UPSERT.method.toLowerCase()
        ](API_ENDPOINTS.PRODUCTS.UPSERT.url, productData, {
          headers: {
            "Content-Type": "multipart/form-data" // For image upload
          }
        });

        return {
          success: response.data.success,
          message: response.data.message || MESSAGE.SUCCESS_UPDATE_PRODUCT,
          data: response.data.data
        };
      } catch (error) {
        console.error("Error updating product:", error);
        const errorMessage = this.getErrorMessage(error);
        this.error = errorMessage;
        return {
          success: false,
          message: errorMessage
        };
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(productId) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios[
          API_ENDPOINTS.PRODUCTS.DELETE.method.toLowerCase()
        ](API_ENDPOINTS.PRODUCTS.DELETE.url(productId));

        return {
          success: response.data.success,
          message: response.data.message || MESSAGE.SUCCESS_DELETE_PRODUCT,
          data: response.data.data
        };
      } catch (error) {
        console.error("Error deleting product:", error);
        const errorMessage = this.getErrorMessage(error);
        this.error = errorMessage;
        return {
          success: false,
          message: errorMessage
        };
      } finally {
        this.loading = false;
      }
    },

    async fetchExtraInfo() {
      try {
        this.loading = true;
        this.error = null;

        const result = await axios[
          API_ENDPOINTS.PRODUCTS.EXTRA_INFO.method.toLowerCase()
        ](API_ENDPOINTS.PRODUCTS.EXTRA_INFO.url);
        const [categories, promotions, variations] = result.data.data;
        this.categories = categories.map((category) => ({
          categoryID: category.categoryID,
          name: category.name
        }));

        this.promotions = promotions.map((promotion) => ({
          promotionID: promotion.promotionID,
          name: promotion.name,
          discount: promotion.discount,
          startDate: promotion.startDate,
          endDate: promotion.endDate
        }));
        this.variations = variations.map((variation) => ({
          variationID: variation.variationID,
          nameAtribute: variation.nameAtribute
        }));
        return {
          success: true,
          message: "Successfully fetched product extra info"
        };
      } catch (error) {
        console.error("Error fetching extra info:", error);
        const errorMessage = this.getErrorMessage(error);
        this.error = errorMessage;
        return {
          success: false,
          message: errorMessage
        };
      } finally {
        this.loading = false;
      }
    },

    getErrorMessage(error) {
      // Check for validation errors array
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        // Join all error messages with newlines
        return error.response.data.errors.map((err) => err.msg).join("\n");
      }
      // Fallback to standard error message
      return error.response?.data?.message || error.message;
    },

    clearError() {
      this.error = null;
    },

    async updateProductItem(productItem) {
      try {
        this.loading = true;
        this.error = null;

        const formData = new FormData();
        formData.append("productID", productItem.productID);
        if (productItem.productItemID) {
          formData.append("productItemID", productItem.productItemID);
        }
        formData.append("sku", productItem.sku);
        formData.append("price", productItem.price);
        formData.append("quantity", productItem.quantity);

        const attributes = productItem.attributes.map((attr) => ({
          variationID: attr.variationID,
          nameAtribute: attr.nameAtribute,
          value: attr.value
        }));

        formData.append("variationOptionList", JSON.stringify(attributes));

        if (productItem.newImage) {
          formData.append("file", productItem.newImage);
        }
        for (const [key, value] of formData.entries()) {
          console.log(key, value);
        }
        const response = await axios.put(
          API_ENDPOINTS.PRODUCT_ITEM.UPSERT.url,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        return {
          success: response.data.success,
          message: "Product item updated successfully",
          data: response.data.data
        };
      } catch (error) {
        console.error("Error updating product item:", error);
        const errorMessage = this.getErrorMessage(error);
        this.error = errorMessage;
        return {
          success: false,
          message: errorMessage
        };
      } finally {
        this.loading = false;
      }
    },

    addProductItem() {
      this.currentProductItems.push({
        sku: "",
        price: 0,
        quantity: 0,
        image: "",
        attributes: [],
        isNew: true
      });
      this.modifiedItems.add(this.currentProductItems.length - 1);
    },

    removeProductItem(index) {
      const item = this.currentProductItems[index];
      if (!item.isNew && item.productItemID) {
        this.deletedItemIds.push(item.productItemID);
      }
      this.currentProductItems.splice(index, 1);
    },

    addAttribute(itemIndex) {
      if (!this.hasAvailableVariations(itemIndex)) return;

      const availableVars = this.availableVariations(itemIndex, -1);
      const defaultVariation = availableVars[0];

      this.currentProductItems[itemIndex].attributes.push({
        variationID: defaultVariation.variationID,
        nameAtribute: defaultVariation.nameAtribute,
        value: ""
      });
      this.modifiedItems.add(itemIndex);
    },

    removeAttribute(itemIndex, attrIndex) {
      this.currentProductItems[itemIndex].attributes.splice(attrIndex, 1);
      this.modifiedItems.add(itemIndex);
    },

    handleVariationChange(variationID, itemIndex, attrIndex) {
      const variation = this.variations.find(
        (v) => v.variationID === variationID
      );
      if (variation) {
        this.currentProductItems[itemIndex].attributes[attrIndex].nameAtribute =
          variation.nameAtribute;
      }
      this.modifiedItems.add(itemIndex);
    },

    isItemModified(index) {
      return this.modifiedItems.has(index);
    },

    availableVariations(itemIndex, currentAttrIndex) {
      const item = this.currentProductItems[itemIndex];
      const usedVariationIDs = new Set(
        item.attributes
          .map((attr) => attr.variationID)
          .filter((id, index) => index !== currentAttrIndex && id !== "")
      );

      return this.variations.filter(
        (variation) => !usedVariationIDs.has(variation.variationID)
      );
    },

    hasAvailableVariations(itemIndex) {
      return this.availableVariations(itemIndex, -1).length > 0;
    },

    setCurrentProductItems(items) {
      this.currentProductItems = items;
    },

    clearModifiedItems() {
      this.modifiedItems.clear();
    },

    clearDeletedItemIds() {
      this.deletedItemIds = [];
    }
  }
});
