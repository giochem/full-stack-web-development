import express from "express";
import { authorizeRoles } from "../middlewares/authen.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  validateGetCarts,
  validateUpsertCart
} from "../validations/carts.validation.js";
import {
  handleGetCarts,
  handleGetOwnerCart,
  handleUpsertCart
} from "../controllers/carts.controller.js";

const router = express.Router();

router.get(
  "/",
  authorizeRoles("admin", "client"),
  validateGetCarts,
  validate,
  handleGetCarts
);

router.get("/owner", authorizeRoles("admin", "client"), handleGetOwnerCart);

router.put(
  "/",
  authorizeRoles("client", "admin"),
  validateUpsertCart,
  validate,
  handleUpsertCart
);

export default router;
