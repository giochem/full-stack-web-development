import express from "express";
import { authorizeRoles } from "../middlewares/authen.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import categoryValidation from "../validations/categories.validation.js";
import { getCategories, upsertCategory, deleteCategory } from "../controllers/categories.controller.js";

const router = express.Router();

router.get("/", getCategories);

router.put(
    "/",
    authorizeRoles("admin"),
    categoryValidation.upsertCategory,
    validate,
    upsertCategory
);

router.delete(
    "/:categoryID",
    authorizeRoles("admin"),
    categoryValidation.deleteCategory,
    validate,
    deleteCategory
);

export default router;
