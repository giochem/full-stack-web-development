import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/constants";

const MESSAGE = {
  SUCCESS_SAVE_PROMOTION: "Promotion saved successfully",
  ERROR_SAVE_PROMOTION: "Failed to save promotion",
  SUCCESS_DELETE_PROMOTION: "Promotion deleted successfully",
  ERROR_DELETE_PROMOTION: "Failed to delete promotion",
};

export const usePromotionStore = defineStore("promotion", {
  state: () => ({
    promotions: [],
    loading: false,
    error: null,
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

    async fetchPromotions() {
      this.loading = true;
      try {
        const { url, method } = API_ENDPOINTS.PROMOTIONS.LIST;
        const response = await axios[method.toLowerCase()](url);
        this.promotions = response.data.data;
        this.error = null;
      } catch (err) {
        this.error = this.getErrorMessage(err);
      } finally {
        this.loading = false;
      }
    },

    async upsertPromotion(data) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios[
          API_ENDPOINTS.PROMOTIONS.UPSERT.method.toLowerCase()
        ](API_ENDPOINTS.PROMOTIONS.UPSERT.url, {
          promotionID: data.promotionID,
          name: data.name.trim(),
          discount: data.discount,
          startDate: data.startDate,
          endDate: data.endDate,
        });

        if (response.data.success) {
          await this.fetchPromotions();
          return {
            success: true,
            message: MESSAGE.SUCCESS_SAVE_PROMOTION,
            data: response.data.data,
          };
        }

        throw new Error(response.data.message);
      } catch (error) {
        console.error("Error saving promotion:", error);
        return {
          success: false,
          message: this.getErrorMessage(error) || MESSAGE.ERROR_SAVE_PROMOTION,
        };
      } finally {
        this.loading = false;
      }
    },

    async deletePromotion(promotionId) {
      try {
        this.loading = true;
        this.error = null;

        const { url, method } = API_ENDPOINTS.PROMOTIONS.DELETE;
        const response = await axios[method.toLowerCase()](url(promotionId));

        if (response.data.success) {
          this.promotions = this.promotions.filter(
            (p) => p.promotionID !== promotionId
          );
          return {
            success: true,
            message: MESSAGE.SUCCESS_DELETE_PROMOTION,
          };
        }

        throw new Error(response.data.message);
      } catch (error) {
        console.error("Error deleting promotion:", error);
        return {
          success: false,
          message:
            this.getErrorMessage(error) || MESSAGE.ERROR_DELETE_PROMOTION,
        };
      } finally {
        this.loading = false;
      }
    },
  },
});
