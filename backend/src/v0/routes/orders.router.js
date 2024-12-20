import express from "express";
import { authorizeRoles } from "../middlewares/authen.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import orderValidation from "../validations/orders.validation.js";
import * as orderController from "../controllers/orders.controller.js";

const router = express.Router();

router.get(
  "/",
  // authorizeRoles("admin", "client"),
  orderValidation.getOrders,
  validate,
  orderController.getOrders
);
router.get(
  "/owner",
  authorizeRoles("admin", "client"),
  orderController.getOwnerOrders
);

router.post(
  "/",
  authorizeRoles("client", "admin"),
  orderValidation.createOrder,
  validate,
  orderController.createOrder
);
router.put(
  "/:orderID",
  authorizeRoles("admin", "client"),
  orderValidation.updateOrder,
  validate,
  orderController.updateOrder
);

export default router;
