const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middlewares/authen.middleware");
const cartController = require("../controllers/carts.controller");

router.get("/", authorizeRoles("client", "admin"), cartController.getCarts);
router.get(
  "/:userID",
  authorizeRoles("client", "admin"),
  cartController.getCart
);

router.put("/", authorizeRoles("admin"), cartController.updateCart);

module.exports = router;
