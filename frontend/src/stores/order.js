import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/constants";

export const useOrderStore = defineStore("order", {
  state: () => ({
    currentOrder: null,
    orders: [],
    loading: false,
    error: null,
    successOrder: null
  }),

  actions: {
    async createOrder(orderData) {
      try {
        this.loading = true;
        const response = await axios[
          API_ENDPOINTS.ORDERS.CREATE.method.toLowerCase()
        ](API_ENDPOINTS.ORDERS.CREATE.url, orderData);
        if (response.data.success) {
          this.successOrder = true;
          return {
            success: true,
            message: response.data.message || "Order created successfully"
          };
        }

        return {
          success: false,
          error: "Failed to create order"
        };
      } catch (error) {
        console.error("Error creating order:", error);
        return {
          success: false,
          error: error.response?.data?.message || "Error creating order"
        };
      } finally {
        this.loading = false;
      }
    },

    clearSuccessOrder() {
      this.successOrder = null;
    },

    async fetchOwnerOrders() {
      try {
        this.loading = true;
        const response = await axios[
          API_ENDPOINTS.ORDERS.OWNER.method.toLowerCase()
        ](API_ENDPOINTS.ORDERS.OWNER.url);
        this.orders = response.data.data;
        return { success: true, orders: this.orders };
      } catch (error) {
        console.error("Error fetching owner orders:", error);
        return {
          success: false,
          error: error.response?.data?.message || "Error fetching owner orders"
        };
      } finally {
        this.loading = false;
      }
    },

    async fetchOrderList(page = 0, size = 10) {
      try {
        this.loading = true;
        const response = await axios[
          API_ENDPOINTS.ORDERS.LIST.method.toLowerCase()
        ](API_ENDPOINTS.ORDERS.LIST.url(page, size));
        this.orders = response.data.data;
        return { success: true, orders: this.orders };
      } catch (error) {
        console.error("Error fetching orders:", error);
        return {
          success: false,
          error: error.response?.data?.message || "Error fetching orders"
        };
      } finally {
        this.loading = false;
      }
    }
  }
});
