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
  ERROR_DELETE_PRODUCT: "Failed to delete product",
};

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    hasNextPage: true,
  }),

  actions: {
    async fetchProducts(page = 0, size = 10) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios[
          API_ENDPOINTS.PRODUCTS.LIST.method.toLowerCase()
        ](API_ENDPOINTS.PRODUCTS.LIST.url(page, size));

        this.products = response.data.data;
        // If we get less items than the page size, we know there's no next page
        this.hasNextPage = this.products.length >= size;

        return {
          success: response.data.success,
          message: response.data.message || MESSAGE.SUCCESS_GET_PRODUCTS,
          data: this.products,
        };
      } catch (error) {
        console.error("Error fetching products:", error);
        const errorMessage = this.getErrorMessage(error);
        this.error = errorMessage;
        return {
          success: false,
          message: errorMessage,
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

        this.currentProduct = response.data.data[0];
        return {
          success: response.data.success,
          message: response.data.message || MESSAGE.SUCCESS_GET_PRODUCT,
          data: this.currentProduct,
        };
      } catch (error) {
        console.error("Error fetching product:", error);
        const errorMessage = this.getErrorMessage(error);
        this.error = errorMessage;
        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        this.loading = false;
      }
    },

    async createProduct(productData) {
      try {
        this.loading = true;
        this.error = null;
        console.log("run herer");
        const response = await axios[
          API_ENDPOINTS.PRODUCTS.CREATE.method.toLowerCase()
        ](API_ENDPOINTS.PRODUCTS.CREATE.url, productData, {
          headers: {
            "Content-Type": "multipart/form-data", // For image upload
          },
        });

        return {
          success: response.data.success,
          message: response.data.message || MESSAGE.SUCCESS_CREATE_PRODUCT,
          data: response.data.data,
        };
      } catch (error) {
        console.error("Error creating product:", error);
        const errorMessage = this.getErrorMessage(error);
        this.error = errorMessage;
        return {
          success: false,
          message: errorMessage,
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
          API_ENDPOINTS.PRODUCTS.UPDATE.method.toLowerCase()
        ](API_ENDPOINTS.PRODUCTS.UPDATE.url(productId), productData, {
          headers: {
            "Content-Type": "multipart/form-data", // For image upload
          },
        });

        return {
          success: response.data.success,
          message: response.data.message || MESSAGE.SUCCESS_UPDATE_PRODUCT,
          data: response.data.data,
        };
      } catch (error) {
        console.error("Error updating product:", error);
        const errorMessage = this.getErrorMessage(error);
        this.error = errorMessage;
        return {
          success: false,
          message: errorMessage,
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
          data: response.data.data,
        };
      } catch (error) {
        console.error("Error deleting product:", error);
        const errorMessage = this.getErrorMessage(error);
        this.error = errorMessage;
        return {
          success: false,
          message: errorMessage,
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
  },
});
