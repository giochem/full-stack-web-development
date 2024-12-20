import express from "express";
import { authorizeRoles } from "../middlewares/authen.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  validateUpsertCategory,
  validateDeleteCategory
} from "../validations/categories.validation.js";
import {
  handleGetCategories,
  handleUpsertCategory,
  handleDeleteCategory
} from "../controllers/categories.controller.js";

const router = express.Router();

router.get("/", handleGetCategories);

router.put(
  "/",
  authorizeRoles("admin"),
  validateUpsertCategory,
  validate,
  handleUpsertCategory
);

router.delete(
  "/:categoryID",
  authorizeRoles("admin"),
  validateDeleteCategory,
  validate,
  handleDeleteCategory
);

export default router;
