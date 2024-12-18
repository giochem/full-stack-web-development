import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/constants";

// Constants for messages
const MESSAGE = {
  SUCCESS_GET_USERS: "Successfully retrieved users",
  SUCCESS_GET_USER: "Successfully retrieved user",
  SUCCESS_UPDATE_USER: "Successfully updated user",
  SUCCESS_CREATE_USER: "Successfully created user",
  SUCCESS_SEARCH_USERS: "Successfully searched users",
  ERROR_USER_NOT_FOUND: "User not found",
  ERROR_UPDATE_USER: "Failed to update user",
  ERROR_CREATE_USER: "Failed to create user",
  ERROR_SEARCH_USERS: "Failed to search users"
};

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    hasNextPage: true,
    searchText: ""
  }),

  actions: {
    async fetchUsers(page = 0, size = 10, filters = {}) {
      try {
        this.loading = true;
        this.error = null;

        const params = {
          page,
          size,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          ...(filters.filterRole && { role: filters.filterRole }),
          ...(filters.searchText && { searchText: filters.searchText })
        };

        const response = await axios[
          API_ENDPOINTS.USERS.LIST.method.toLowerCase()
        ](API_ENDPOINTS.USERS.LIST.url(page, size), { params });

        this.users = response.data.data;
        this.hasNextPage = this.users.length >= size;

        return {
          success: response.data.success,
          message: response.data.message || MESSAGE.SUCCESS_GET_USERS,
          data: this.users
        };
      } catch (error) {
        console.error("Error fetching users:", error);
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

    async searchUsers(searchText) {
      try {
        this.loading = true;
        this.error = null;
        this.searchText = searchText;

        const response = await axios[
          API_ENDPOINTS.USERS.SEARCH.method.toLowerCase()
        ](API_ENDPOINTS.USERS.SEARCH.url, {
          params: { searchText: searchText }
        });

        this.users = response.data.data;
        // No pagination for search results
        this.hasNextPage = false;

        return {
          success: response.data.success,
          message: response.data.message || MESSAGE.SUCCESS_SEARCH_USERS,
          data: this.users
        };
      } catch (error) {
        console.error("Error searching users:", error);
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

    async getUserByUserID(userID) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios[
          API_ENDPOINTS.USERS.GET_BY_ID.method.toLowerCase()
        ](API_ENDPOINTS.USERS.GET_BY_ID.url(userID));

        this.currentUser = response.data.data[0];
        return {
          success: response.data.success,
          message: response.data.message || MESSAGE.SUCCESS_GET_USER,
          data: this.currentUser
        };
      } catch (error) {
        console.error("Error fetching user:", error);
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

    async createUser(userData) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios[
          API_ENDPOINTS.USERS.CREATE.method.toLowerCase()
        ](API_ENDPOINTS.USERS.CREATE.url, userData);

        return {
          success: response.data.success,
          message: response.data.message || MESSAGE.SUCCESS_CREATE_USER,
          data: response.data.data
        };
      } catch (error) {
        console.error("Error creating user:", error);
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

    clearSearch() {
      this.searchText = "";
      this.hasNextPage = true;
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
    }
  }
});
