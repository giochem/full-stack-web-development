import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/constants";

// Constants for messages
const MESSAGE = {
  SUCCESS_GET_VARIATIONS: "Successfully retrieved variations",
  SUCCESS_SAVE_VARIATION: "Successfully saved variation",
  SUCCESS_DELETE_VARIATION: "Successfully deleted variation",
  ERROR_GET_VARIATIONS: "Failed to fetch variations",
  ERROR_SAVE_VARIATION: "Failed to save variation",
  ERROR_DELETE_VARIATION: "Failed to delete variation"
};

export const useVariationStore = defineStore("variation", {
  state: () => ({
    variations: [],
    loading: false,
    error: null
  }),

  getters: {
    getVariationById: (state) => (id) => {
      return state.variations.find((v) => v.variationID === id);
    },

    getVariationByName: (state) => (name) => {
      return state.variations.find((v) => v.name === name);
    }
  },

  actions: {
    async fetchVariations() {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios[
          API_ENDPOINTS.VARIATIONS.LIST.method.toLowerCase()
        ](API_ENDPOINTS.VARIATIONS.LIST.url);

        if (response.data.success) {
          this.variations = response.data.data.map((variation) => ({
            variationID: variation.variationID,
            name: variation.nameAtribute
          }));
        }

        return {
          success: true,
          message: MESSAGE.SUCCESS_GET_VARIATIONS,
          data: this.variations
        };
      } catch (error) {
        console.error("Error fetching variations:", error);
        this.error = this.getErrorMessage(error);
        return {
          success: false,
          message: this.error || MESSAGE.ERROR_GET_VARIATIONS
        };
      } finally {
        this.loading = false;
      }
    },

    async upsertVariation(data) {
      try {
        this.loading = true;
        this.error = null;

        if (!data.nameAtribute?.trim()) {
          throw new Error("Variation name is required");
        }

        const response = await axios[
          API_ENDPOINTS.VARIATIONS.UPSERT.method.toLowerCase()
        ](API_ENDPOINTS.VARIATIONS.UPSERT.url, {
          variationID: data.variationID,
          nameAtribute: data.nameAtribute.trim()
        });

        if (response.data.success) {
          await this.fetchVariations();
          return {
            success: true,
            message: MESSAGE.SUCCESS_SAVE_VARIATION,
            data: response.data.data
          };
        }

        throw new Error(response.data.message);
      } catch (error) {
        console.error("Error saving variation:", error);
        return {
          success: false,
          message: this.getErrorMessage(error) || MESSAGE.ERROR_SAVE_VARIATION
        };
      } finally {
        this.loading = false;
      }
    },

    async deleteVariation(variationID) {
      try {
        this.loading = true;
        this.error = null;

        if (!variationID) {
          throw new Error("Variation ID is required");
        }

        const response = await axios[
          API_ENDPOINTS.VARIATIONS.DELETE.method.toLowerCase()
        ](API_ENDPOINTS.VARIATIONS.DELETE.url(variationID));

        if (response.data.success) {
          await this.fetchVariations();
          return {
            success: true,
            message: MESSAGE.SUCCESS_DELETE_VARIATION
          };
        }

        throw new Error(response.data.message);
      } catch (error) {
        console.error("Error deleting variation:", error);
        return {
          success: false,
          message: this.getErrorMessage(error) || MESSAGE.ERROR_DELETE_VARIATION
        };
      } finally {
        this.loading = false;
      }
    },

    getErrorMessage(error) {
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        return error.response.data.errors.map((err) => err.msg).join("\n");
      }
      return error.response?.data?.message || error.message;
    },

    clearError() {
      this.error = null;
    },

    resetState() {
      this.variations = [];
      this.loading = false;
      this.error = null;
    }
  }
});
