const { body, query, param } = require("express-validator");

module.exports = {
  getProducts: [
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
      .withMessage("filterCategory in query must be an integer"),
  ],

  getProduct: [
    param("productID")
      .notEmpty()
      .withMessage("productID is required")
      .isInt()
      .withMessage("productID must be an integer"),
  ],

  createProduct: [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("description")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
    body("promotionID")
      .optional()
      .isInt()
      .withMessage("promotionID must be an integer"),
    body("categoryID")
      .optional()
      .isInt()
      .withMessage("categoryID must be an integer"),
  ],
  createProductItem: [
    body("productID")
      .notEmpty()
      .withMessage("productID is required")
      .isInt()
      .withMessage("productID must be an integer"),
    body("productList")
      .notEmpty()
      .withMessage("productList is required")
      .isArray()
      .withMessage("productList must be an array"),
  ],

  updateProduct: [
    param("productID")
      .notEmpty()
      .withMessage("productID is required")
      .isInt()
      .withMessage("productID must be an integer"),
    param("promotionID")
      .optional()
      .isInt()
      .withMessage("promotionID must be an integer"),
    param("categoryID")
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
  ],

  deleteProduct: [
    param("productID")
      .notEmpty()
      .withMessage("productID is required")
      .isInt()
      .withMessage("productID must be an integer"),
  ],
};
