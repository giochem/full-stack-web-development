import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/constants";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts(page = 0, size = 10) {
      try {
        this.loading = true;
        const response = await axios[API_ENDPOINTS.PRODUCTS.LIST.method.toLowerCase()](
          API_ENDPOINTS.PRODUCTS.LIST.url(page, size)
        );
        this.products = response.data.data;
        return { success: true };
      } catch (err) {
        console.error("Error fetching products:", err);
        this.error = "Error fetching products";
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async fetchProductById(productId) {
      try {
        this.loading = true;
        const response = await axios[API_ENDPOINTS.PRODUCTS.DETAIL.method.toLowerCase()](
          API_ENDPOINTS.PRODUCTS.DETAIL.url(productId)
        );
        this.currentProduct = response.data.data[0];
        return { success: true, product: this.currentProduct };
      } catch (err) {
        console.error("Error fetching product:", err);
        this.error = "Error fetching product details";
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
  },
}); 