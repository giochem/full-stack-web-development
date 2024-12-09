const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middlewares/authen.middleware");
const { validate } = require("../middlewares/validate.middleware");
const categoryValidation = require("../validations/categories.validation");
const categoryController = require("../controllers/categories.controller");

router.get("/", categoryController.getCategories);

router.put(
  "/",
  authorizeRoles("admin"),
  categoryValidation.upsertCategory,
  validate,
  categoryController.upsertCategory
);

router.delete(
  "/:categoryID",
  authorizeRoles("admin"),
  categoryValidation.deleteCategory,
  validate,
  categoryController.deleteCategory
);

module.exports = router;
