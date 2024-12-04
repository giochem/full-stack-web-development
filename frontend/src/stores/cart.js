import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/constants";

export const useCartStore = defineStore("cart", {
  state: () => ({
    itemCount: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async updateCartCount() {
      try {
        const response = await axios[API_ENDPOINTS.CART.LIST.method.toLowerCase()](
          API_ENDPOINTS.CART.LIST.url
        );
        this.itemCount = response.data.data.length;
        return { success: true };
      } catch (error) {
        console.error("Error updating cart count:", error);
        this.itemCount = 0;
        return { success: false, error: error.message };
      }
    },

    async addToCart(productID, quantity) {
      try {
        this.loading = true;
        const data = { productID, quantity };
        const response = await axios[API_ENDPOINTS.CART.UPSERT.method.toLowerCase()](
          API_ENDPOINTS.CART.UPSERT.url,
          data
        );
        await this.updateCartCount();
        return { success: true, data: response.data };
      } catch (error) {
        console.error("Error adding to cart:", error);
        return {
          success: false,
          error: error.response?.data?.message || "Error adding to cart",
        };
      } finally {
        this.loading = false;
      }
    },

    async fetchCartItems() {
      try {
        this.loading = true;
        const response = await axios[API_ENDPOINTS.CART.LIST.method.toLowerCase()](
          API_ENDPOINTS.CART.LIST.url
        );
        return { success: true, data: response.data.data };
      } catch (error) {
        console.error("Error fetching cart items:", error);
        return {
          success: false,
          error: error.response?.data?.message || "Error fetching cart items",
        };
      } finally {
        this.loading = false;
      }
    },
  },
});
