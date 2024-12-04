const { body, query, param } = require("express-validator");

module.exports = {
  getProducts: [
    query("page")
      .isInt({ min: 0 })
      .withMessage("page in query is required and >= 0"),
    query("size")
      .isInt({ min: 1 })
      .withMessage("size in query is required and >= 1"),
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
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
    body("color")
      .isString()
      .withMessage("Color must be a string")
      .isLength({ max: 50 })
      .withMessage("Color cannot exceed 50 characters"),
    body("size")
      .isString()
      .withMessage("Size must be a string")
      .isLength({ max: 20 })
      .withMessage("Size cannot exceed 20 characters"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("quantity")
      .notEmpty()
      .withMessage("Quantity is required")
      .isInt({ min: 0 })
      .withMessage("Quantity must be a positive integer"),
  ],

  updateProduct: [
    param("productID")
      .notEmpty()
      .withMessage("productID is required")
      .isInt()
      .withMessage("productID must be an integer"),
    body("name")
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("description")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
    body("color")
      .optional()
      .isString()
      .withMessage("Color must be a string")
      .isLength({ max: 50 })
      .withMessage("Color cannot exceed 50 characters"),
    body("size")
      .optional()
      .isString()
      .withMessage("Size must be a string")
      .isLength({ max: 20 })
      .withMessage("Size cannot exceed 20 characters"),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("quantity")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Quantity must be a positive integer"),
  ],

  deleteProduct: [
    param("productID")
      .notEmpty()
      .withMessage("productID is required")
      .isInt()
      .withMessage("productID must be an integer"),
  ],
}; 