const express = require("express");
const router = express.Router();
const { upload } = require("../configs/storage");
const { authorizeRoles } = require("../middlewares/authen.middleware");
const { validate } = require("../middlewares/validate.middleware");
const productValidation = require("../validations/products.validation");
const productController = require("../controllers/products.controller");

router.post("/",
  authorizeRoles("admin"),
  upload.single("file"),
  productValidation.createProduct,
  validate,
  productController.createProduct
);

router.get("/",
  productValidation.getProducts,
  validate,
  productController.getProducts
);

router.get("/:productID",
  productValidation.getProduct,
  validate,
  productController.getProduct
);

router.put("/:productID",
  authorizeRoles("admin"),
  upload.single("file"),
  productValidation.updateProduct,
  validate,
  productController.updateProduct
);

router.delete("/:productID",
  authorizeRoles("admin"),
  productValidation.deleteProduct,
  validate,
  productController.deleteProduct
);

module.exports = router;
