const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middlewares/authen.middleware");
const { validate } = require("../middlewares/validate.middleware");
const cartValidation = require("../validations/carts.validation");
const cartController = require("../controllers/carts.controller");

router.get(
  "/",
  authorizeRoles("admin", "client"),
  cartValidation.getCarts,
  validate,
  cartController.getCarts
);
router.get(
  "/owner",
  authorizeRoles("admin", "client"),
  cartController.getOwnerCart
);

router.put(
  "/",
  authorizeRoles("client", "admin"),
  cartValidation.updateCart,
  validate,
  cartController.updateCart
);

module.exports = router;
