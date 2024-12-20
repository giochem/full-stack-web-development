import express from "express";
import { upload } from "../configs/storage.js";
import { authorizeRoles } from "../middlewares/authen.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import productValidation from "../validations/products.validation.js";
import * as productController from "../controllers/products.controller.js";

const router = express.Router();

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

export default router;
