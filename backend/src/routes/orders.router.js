const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middlewares/authen.middleware");
const orderController = require("../controllers/orders.controller");

router.post("/:userID", authorizeRoles("admin"), orderController.createOrder);
router.get("/", authorizeRoles("client", "admin"), orderController.getOrders);
router.get(
  "/:orderID",
  authorizeRoles("client", "admin"),
  orderController.getOrder
);

router.put("/orderID", authorizeRoles("admin"), orderController.updateOrder);

module.exports = router;
