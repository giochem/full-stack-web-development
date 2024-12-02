const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middlewares/authen.middleware");
const { validate } = require("../middlewares/validate.middleware");
const cartValidation = require("../validations/carts.validation");
const cartController = require("../controllers/carts.controller");

// router.post("/",
//   authorizeRoles("client"),
//   cartValidation.createCart,
//   validate,
//   cartController.createCart
// );

router.get(
  "/",
  authorizeRoles("admin", "client"),
  cartValidation.getCarts,
  validate,
  cartController.getCarts
);

router.get(
  "/:cartID",
  authorizeRoles("admin", "client"),
  cartValidation.getCart,
  validate,
  cartController.getCart
);

router.put(
  "/:cartID",
  authorizeRoles("client"),
  cartValidation.updateCart,
  validate,
  cartController.updateCart
);

// router.delete("/:cartID",
//   authorizeRoles("client"),
//   cartValidation.deleteCart,
//   validate,
//   cartController.deleteCart
// );

module.exports = router;
