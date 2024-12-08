const express = require("express");
const router = express.Router();
const { upload } = require("../configs/storage");
const { authorizeRoles } = require("../middlewares/authen.middleware");
const { validate } = require("../middlewares/validate.middleware");
const productValidation = require("../validations/products.validation");
const productController = require("../controllers/products.controller");

router.get(
  "/",
  productValidation.getProducts,
  validate,
  productController.getProducts
);
router.get("/extra-info", productController.getProductExtraInfo);
router.get(
  "/:productID",
  productValidation.getProduct,
  validate,
  productController.getProduct
);

router.put(
  "/",
  // authorizeRoles("admin"),
  upload.single("file"),
  productValidation.upsertProduct,
  validate,
  productController.upsertProduct
);

router.put(
  "/product-item",
  // authorizeRoles("admin"),
  upload.single("file"),
  productValidation.upsertProductItem,
  validate,
  productController.upsertProductItem
);

router.delete(
  "",
  // authorizeRoles("admin"),
  productValidation.deleteProduct,
  validate,
  productController.deleteProduct
);

module.exports = router;
