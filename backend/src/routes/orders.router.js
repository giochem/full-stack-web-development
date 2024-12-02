const express = require("express");
const router = express.Router();

const { authorizeRoles } = require("../middlewares/authen.middleware");
const { validate } = require("../middlewares/validate.middleware");
const orderValidation = require("../validations/orders.validation");
const orderController = require("../controllers/orders.controller");

router.post(
  "/",
  authorizeRoles("client", "admin"),
  // orderValidation.createOrder,
  // validate,
  orderController.createOrder
);

router.get(
  "/",
  authorizeRoles("admin", "client"),
  orderValidation.getOrders,
  validate,
  orderController.getOrders
);
router.get(
  "/owner",
  authorizeRoles("admin", "client"),
  orderController.getOwnerOrders
);

router.get(
  "/:orderID",
  authorizeRoles("admin", "client"),
  orderValidation.getOrderItem,
  validate,
  orderController.getOrderItem
);

router.put(
  "/:orderID",
  authorizeRoles("admin", "client"),
  orderValidation.updateOrder,
  validate,
  orderController.updateOrder
);

module.exports = router;
