import { defineStore } from "pinia";
import axios from "axios";

export const useCartStore = defineStore("cart", {
  state: () => ({
    itemCount: 0,
  }),
  actions: {
    async updateCartCount() {
      try {
        // const response = await axios.get('http://localhost:5000/api/carts', {
        //   withCredentials: true
        // });
        // this.itemCount = response.data.data.length;
        this.itemCount = 10;
      } catch (error) {
        console.error("Error updating cart count:", error);
        this.itemCount = 0;
      }
    },
  },
});
