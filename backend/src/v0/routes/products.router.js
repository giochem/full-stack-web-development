import express from "express";
import { upload } from "../configs/storage.js";
import { authorizeRoles } from "../middlewares/authen.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  validateGetProducts,
  validateGetProduct,
  validateUpsertProduct,
  validateUpsertProductItem,
  validateDeleteProduct
} from "../validations/products.validation.js";
import {
  handleGetProducts,
  handleGetProductExtraInfo,
  handleGetProduct,
  handleUpsertProduct,
  handleUpsertProductItem,
  handleDeleteProduct
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/", validateGetProducts, validate, handleGetProducts);
router.get("/extra-info", handleGetProductExtraInfo);
router.get("/:productID", validateGetProduct, validate, handleGetProduct);

router.put(
  "/",
  authorizeRoles("admin"),
  upload.single("file"),
  validateUpsertProduct,
  validate,
  handleUpsertProduct
);

router.put(
  "/product-item",
  authorizeRoles("admin"),
  upload.single("file"),
  validateUpsertProductItem,
  validate,
  handleUpsertProductItem
);

router.delete(
  "",
  authorizeRoles("admin"),
  validateDeleteProduct,
  validate,
  handleDeleteProduct
);

export default router;
