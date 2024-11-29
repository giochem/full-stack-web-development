const express = require("express");
const router = express.Router();
const { upload } = require("../configs/storage");
const { authorizeRoles } = require("../middlewares/authen.middleware");
const productController = require("../controllers/products.controller");

router.post(
  "/",
  authorizeRoles("admin"),
  upload.single("file"),
  productController.createProduct
);

router.get("/", productController.getProducts);
router.get("/:productID", productController.getProduct);

router.put(
  "/:productID",
  authorizeRoles("admin"),
  upload.single("file"),
  productController.updateProduct
);
router.delete(
  "/:productID",
  authorizeRoles("admin"),
  productController.deleteProduct
);

module.exports = router;
