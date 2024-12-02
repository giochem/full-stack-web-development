const express = require("express");
const router = express.Router();

const { authorizeRoles } = require("../middlewares/authen.middleware");
const { validate } = require("../middlewares/validate.middleware");
const orderValidation = require("../validations/orders.validation");
const orderController = require("../controllers/orders.controller");

router.post(
  "/",
  authorizeRoles("client"),
  orderValidation.createOrder,
  validate,
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
  "/:orderID",
  authorizeRoles("admin", "client"),
  orderValidation.getOrder,
  validate,
  orderController.getOrder
);

router.put(
  "/:orderID",
  authorizeRoles("admin"),
  orderValidation.updateOrder,
  validate,
  orderController.updateOrder
);

// router.delete("/:orderID",
//   authorizeRoles("admin"),
//   orderValidation.deleteOrder,
//   validate,
//   orderController.deleteOrder
// );

module.exports = router;
