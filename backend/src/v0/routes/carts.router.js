import express from "express";
import { authorizeRoles } from "../middlewares/authen.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import cartValidation from "../validations/carts.validation.js";
import * as cartController from "../controllers/carts.controller.js";

const router = express.Router();

router.get(
  "/",
  // authorizeRoles("admin", "client"),
  cartValidation.getCarts,
  validate,
  cartController.getCarts
);
// router.get(
//   "/:userID",
//   // authorizeRoles("admin"),
//   cartValidation.getCart,
//   validate,
//   cartController.getCart
// );
router.get(
  "/owner",
  authorizeRoles("admin", "client"),
  cartController.getOwnerCart
);

router.put(
  "/",
  authorizeRoles("client", "admin"),
  cartValidation.upsertCart,
  validate,
  cartController.upsertCart
);

export default router;
