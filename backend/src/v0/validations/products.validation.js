import { body, param, query } from "express-validator";

export const validateGetProducts = [
  query("offset").optional().isInt().toInt(),
  query("page")
    .isInt({ min: 0 })
    .withMessage("page in query is required and >= 0"),
  query("size")
    .isInt({ min: 1 })
    .withMessage("size in query is required and >= 1"),
  query("sortBy")
    .optional()
    .isString()
    .withMessage("sortBy in query must be a string"),
  query("sortOrder")
    .optional()
    .isString()
    .withMessage("sortOrder in query must be a string"),
  query("searchText")
    .optional()
    .isString()
    .withMessage("searchText in query must be a string"),
  query("filterPromotion")
    .optional()
    .isInt()
    .withMessage("filterPromotion in query must be an integer"),
  query("filterCategory")
    .optional()
    .isInt()
    .withMessage("filterCategory in query must be an integer")
];

export const validateGetProduct = [param("productID").isInt().toInt()];

export const validateUpsertProduct = [
  body("productID")
    .optional()
    .isInt()
    .withMessage("productID must be an integer"),
  body("promotionID")
    .optional()
    .isInt()
    .withMessage("promotionID must be an integer"),
  body("categoryID")
    .optional()
    .isInt()
    .withMessage("categoryID must be an integer"),
  body("name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("image").optional().isString().withMessage("image must be a string")
];

export const validateUpsertProductItem = [
  body("productID")
    .optional()
    .isInt()
    .withMessage("productID must be an integer"),
  body("productItemID")
    .optional()
    .isInt()
    .withMessage("productItemID must be an integer"),
  body("sku").optional().isString().withMessage("sku must be a string"),
  body("price").optional().isInt().withMessage("price must be an integer"),
  body("quantity")
    .optional()
    .isInt()
    .withMessage("quantity must be an integer"),
  body("image").optional().isString().withMessage("image must be a string")
];

export const validateDeleteProduct = [
  query("productID")
    .optional()
    .isInt()
    .withMessage("productID must be an integer"),
  query("productItemID")
    .optional()
    .isInt()
    .withMessage("productItemID must be an integer")
];
