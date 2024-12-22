import express from "express";
import { authorizeRoles } from "../middlewares/authen.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  validateGetOrders,
  validateCreateOrder,
  validateUpdateOrder
} from "../validations/orders.validation.js";
import {
  handleGetOrders,
  handleGetOwnerOrders,
  handleCreateOrder,
  handleUpdateOrder
} from "../controllers/orders.controller.js";

const router = express.Router();

router.get(
  "/",
  authorizeRoles("admin", "client"),
  validateGetOrders,
  validate,
  handleGetOrders
);

router.get("/owner", authorizeRoles("admin", "client"), handleGetOwnerOrders);

router.post(
  "/",
  authorizeRoles("client", "admin"),
  validateCreateOrder,
  validate,
  handleCreateOrder
);

router.put(
  "/:orderID",
  authorizeRoles("admin", "client"),
  validateUpdateOrder,
  validate,
  handleUpdateOrder
);

export default router;
