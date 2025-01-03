import { body, param } from "express-validator";

export const validateUpsertCategory = [
  body("categoryID")
    .optional()
    .isInt()
    .withMessage("categoryID must be an integer"),
  body("name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("parentCategoryID")
    .optional()
    .isInt()
    .withMessage("parentCategoryID must be an integer")
];

export const validateDeleteCategory = [
  param("categoryID")
    .notEmpty()
    .withMessage("categoryID is required")
    .isInt()
    .withMessage("categoryID must be an integer")
];
