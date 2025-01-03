import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/constants";

export const useCartStore = defineStore("cart", {
  state: () => ({
    carts: [],
    loading: false,
    error: null,
    totalItems: 0,
    totalPages: 0,
    itemCount: 0
  }),

  actions: {
    getErrorMessage(error) {
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        return error.response.data.errors.map((err) => err.msg).join("\n");
      }
      return error.response?.data?.message || error.message;
    },

    async fetchCarts({
      page = 0,
      size = 10,
      searchText = "",
      sortBy = "userID",
      sortOrder = "asc",
      userID = null
    } = {}) {
      try {
        this.loading = true;
        this.error = null;

        const { url, method } = API_ENDPOINTS.CART.LIST;
        const queryParams = new URLSearchParams();

        // Always include pagination and sorting
        queryParams.append("page", page);
        queryParams.append("size", size);

        // Validate sortable fields
        const validSortFields = ["userID", "quantity", "price", "discount"];
        if (validSortFields.includes(sortBy)) {
          queryParams.append("sortBy", sortBy);
          queryParams.append("sortOrder", sortOrder);
        } else {
          // Default sort if invalid field provided
          queryParams.append("sortBy", "userID");
          queryParams.append("sortOrder", "asc");
        }

        // Optional search parameter
        if (searchText) {
          queryParams.append("searchText", searchText);
        }

        // Add userID filter if provided
        if (userID) {
          queryParams.append("userID", userID);
        }

        const response = await axios[method.toLowerCase()](
          `${url}?${queryParams.toString()}`
        );

        this.carts = response.data.data;
        this.totalItems = response.data.total;
        this.totalPages = Math.ceil(response.data.total / size);
      } catch (error) {
        console.error("Error fetching carts:", error);
        this.error = this.getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },

    // Helper method to calculate final price with discount
    calculateFinalPrice(price, discount) {
      if (!discount) return price;
      return price * (1 - discount / 100);
    },

    async updateCartCount() {
      try {
        const response = await axios[
          API_ENDPOINTS.CART.OWNER.method.toLowerCase()
        ](API_ENDPOINTS.CART.OWNER.url);

        if (response.data.success) {
          // Update both carts and itemCount
          this.carts = response.data.data.map((item) => ({
            ...item,
            // Add any additional transformations needed for cart items
            finalPrice: this.calculateFinalPrice(item.price, item.discount)
          }));

          // Update total count of items in cart
          this.itemCount = this.carts.reduce(
            (total, item) => total + item.quantity,
            0
          );

          return {
            success: true,
            data: this.carts
          };
        }

        return {
          success: false,
          error: "Failed to fetch cart items"
        };
      } catch (error) {
        console.error("Error updating cart count:", error);
        return {
          success: false,
          error: this.getErrorMessage(error)
        };
      }
    },

    async addToCart({ quantity, productItemId }) {
      try {
        this.loading = true;
        const response = await axios[
          API_ENDPOINTS.CART.UPSERT.method.toLowerCase()
        ](API_ENDPOINTS.CART.UPSERT.url, {
          productItemID: productItemId,
          quantity: quantity
        });

        // Update cart count after successful addition
        if (response.data.success) {
          await this.updateCartCount();
        }

        return {
          success: response.data.success,
          message: "Added to cart successfully"
        };
      } catch (error) {
        console.error("Error adding to cart:", error);
        return {
          success: false,
          error: error.response?.data?.message || "Failed to add to cart"
        };
      } finally {
        this.loading = false;
      }
    }
  }
});
