import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/constants";

const MESSAGE = {
  SUCCESS_SAVE_CATEGORY: "Category saved successfully",
  ERROR_SAVE_CATEGORY: "Failed to save category",
  SUCCESS_DELETE_CATEGORY: "Category deleted successfully",
  ERROR_DELETE_CATEGORY: "Failed to delete category"
};

export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [],
    loading: false,
    error: null
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

    async fetchCategories() {
      try {
        this.loading = true;
        this.error = null;

        const { url, method } = API_ENDPOINTS.CATEGORIES.LIST;
        const response = await axios[method.toLowerCase()](url);
        this.categories = response.data.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
        this.error = this.getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },

    async upsertCategory(data) {
      try {
        this.loading = true;
        this.error = null;

        if (!data.name?.trim()) {
          throw new Error("Category name is required");
        }

        const response = await axios[
          API_ENDPOINTS.CATEGORIES.UPSERT.method.toLowerCase()
        ](API_ENDPOINTS.CATEGORIES.UPSERT.url, {
          categoryID: data.categoryID,
          name: data.name.trim()
        });

        if (response.data.success) {
          await this.fetchCategories();
          return {
            success: true,
            message: MESSAGE.SUCCESS_SAVE_CATEGORY,
            data: response.data.data
          };
        }

        throw new Error(response.data.message);
      } catch (error) {
        console.error("Error saving category:", error);
        return {
          success: false,
          message: this.getErrorMessage(error) || MESSAGE.ERROR_SAVE_CATEGORY
        };
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(categoryId) {
      try {
        this.loading = true;
        this.error = null;

        const { url, method } = API_ENDPOINTS.CATEGORIES.DELETE;
        const response = await axios[method.toLowerCase()](url(categoryId));

        if (response.data.success) {
          this.categories = this.categories.filter(
            (c) => c.categoryID !== categoryId
          );
          return {
            success: true,
            message: MESSAGE.SUCCESS_DELETE_CATEGORY
          };
        }

        throw new Error(response.data.message);
      } catch (error) {
        console.error("Error deleting category:", error);
        return {
          success: false,
          message: this.getErrorMessage(error) || MESSAGE.ERROR_DELETE_CATEGORY
        };
      } finally {
        this.loading = false;
      }
    }
  }
});
