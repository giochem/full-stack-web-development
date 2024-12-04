import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { API_ENDPOINTS, APP_CONSTANTS } from "@/utils/constants";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
  }),

  actions: {
    async login(email, password) {
      try {
        const res = await axios[API_ENDPOINTS.AUTH.LOGIN.method.toLowerCase()](
          API_ENDPOINTS.AUTH.LOGIN.url,
          { email, password }
        );
        window.sessionStorage.setItem(
          APP_CONSTANTS.STORAGE_KEYS.IS_LOGGED_IN,
          "true"
        );
        this.user = res.data.data[0];
        this.isAuthenticated = true;
        return { success: true, user: res.data.data[0] };
      } catch (err) {
        const message = err.response?.data?.message || "Có lỗi xảy ra";
        return { success: false, message };
      }
    },

    async register(email, password) {
      try {
        const res = await axios[
          API_ENDPOINTS.AUTH.REGISTER.method.toLowerCase()
        ](API_ENDPOINTS.AUTH.REGISTER.url, { email, password });
        window.sessionStorage.setItem(
          APP_CONSTANTS.STORAGE_KEYS.IS_LOGGED_IN,
          "true"
        );
        this.user = res.data.data[0];
        this.isAuthenticated = true;
        return { success: true, user: res.data.data[0] };
      } catch (err) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.errors ||
          "Có lỗi xảy ra";
        return { success: false, message };
      }
    },

    async fetchProfile() {
      try {
        this.loading = true;
        const response = await axios.get(API_ENDPOINTS.AUTH.PROFILE.url);
        if (response.data.success) {
          this.user = response.data.data[0];
          return { success: true, user: this.user };
        }
        return { success: false, error: "Failed to fetch profile" };
      } catch (error) {
        console.error("Error fetching profile:", error);
        return {
          success: false,
          error: error.response?.data?.message || "Error fetching profile",
        };
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(data) {
      try {
        this.loading = true;
        const response = await axios.put(
          API_ENDPOINTS.AUTH.UPDATE_PROFILE.url,
          data
        );
        if (response.data.success) {
          this.user = response.data.data[0];
          return { success: true, user: this.user };
        }
        return { success: false, error: "Failed to update profile" };
      } catch (error) {
        console.error("Error updating profile:", error);
        return {
          success: false,
          error: error.response?.data?.message || "Error updating profile",
        };
      } finally {
        this.loading = false;
      }
    },
  },
});
