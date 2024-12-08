import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import ClientHome from "../views/client/Home.vue";
// admin
import AdminLayout from "../layouts/AdminLayout.vue";
//import Dashboard from "@/views/admin/Dashboard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/auth",
      name: "auth",
      component: () => import("../views/Auth.vue"),
    },
    {
      path: "/",
      name: "client",
      component: DefaultLayout,
      children: [
        {
          path: "/",
          name: "Home",
          component: ClientHome,
        },
        {
          path: "/product/:productID",
          name: "product",
          component: () => import("../views/client/Product.vue"),
        },
        {
          path: "/cart",
          name: "cart",
          component: () => import("../views/client/Cart.vue"),
        },
        {
          path: "/checkout",
          name: "checkout",
          component: () => import("../views/client/Checkout.vue"),
        },
        {
          path: "/order-success",
          name: "order-success",
          component: () => import("../views/client/OrderSuccess.vue"),
        },
        {
          path: "/profile",
          name: "profile",
          component: () => import("../views/client/Profile.vue"),
        },
      ],
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminLayout,
      redirect: "/admin/dashboard",
      children: [
        {
          path: "/admin/dashboard",
          name: "dashboard",
          component: () => import("../views/admin/Dashboard.vue"),
        },
        // manage user
        {
          path: "/admin/manage-user",
          name: "manage-user",
          component: () => import("../views/admin/ManageUser.vue"),
        },
        {
          path: "/admin/add-user",
          name: "add-user",
          component: () => import("../views/admin/AddUser.vue"),
        },
        {
          path: "/admin/edit-user/:userID",
          name: "edit-user",
          component: () => import("../views/admin/EditUser.vue"),
        },
        // manage product
        {
          path: "/admin/manage-product",
          name: "manage-product",
          component: () => import("../views/admin/ManageProduct.vue"),
        },
        {
          path: "/admin/edit-product/:productID",
          name: "edit-product",
          component: () => import("../views/admin/EditProduct.vue"),
        },
        {
          path: "/admin/add-product",
          name: "add-product",
          component: () => import("../views/admin/AddProduct.vue"),
        },
        // manage collection
        {
          path: "/admin/manage-collection",
          name: "manage-collection",
          component: () => import("../views/admin/ManageCollection.vue"),
        },
        {
          path: "/admin/edit-collection/:collectionID",
          name: "edit-collection",
          component: () => import("../views/admin/EditCollection.vue"),
        },
        {
          path: "/admin/add-collection",
          name: "add-collection",
          component: () => import("../views/admin/AddCollection.vue"),
        },
        // manage promotion
        {
          path: "/admin/manage-promotion",
          name: "manage-promotion",
          component: () => import("../views/admin/ManagePromotion.vue"),
        },
        {
          path: "/admin/edit-promotion/:promotionID",
          name: "edit-promotion",
          component: () => import("../views/admin/EditPromotion.vue"),
        },
        {
          path: "/admin/add-promotion",
          name: "add-promotion",
          component: () => import("../views/admin/AddPromotion.vue"),
        },
        {
          path: "/admin/manage-cart",
          name: "ManageCart",
          component: () => import("../views/admin/ManageCart.vue"),
        },
        {
          path: "/admin/manage-order",
          name: "manage-order",
          component: () => import("../views/admin/ManageOrder.vue"),
        },
        {
          path: "/admin/edit-order/:orderID",
          name: "edit-order",
          component: () => import("../views/admin/EditOrder.vue"),
        },
        {
          path: "/admin/manage-variations",
          name: "ManageVariations",
          component: () => import("../views/admin/ManageVariations.vue"),
        },
      ],
    },
  ],
});
export default router;
