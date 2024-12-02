const { body, query, param } = require("express-validator");

module.exports = {
  getCarts: [
    query("page")
      .isInt({ min: 0 })
      .withMessage("page in query is required and >= 0"),
    query("size")
      .isInt({ min: 1 })
      .withMessage("size in query is required and >= 1"),
  ],

  getCart: [
    param("cartID")
      .notEmpty()
      .withMessage("cartID is required")
      .isInt()
      .withMessage("cartID must be an integer"),
  ],

  createCart: [
    body("userID")
      .notEmpty()
      .withMessage("userID is required")
      .isInt()
      .withMessage("userID must be an integer"),
    body("productID")
      .notEmpty()
      .withMessage("productID is required")
      .isInt()
      .withMessage("productID must be an integer"),
    body("quantity")
      .notEmpty()
      .withMessage("Quantity is required")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],

  updateCart: [
    param("cartID")
      .notEmpty()
      .withMessage("cartID is required")
      .isInt()
      .withMessage("cartID must be an integer"),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],

  deleteCart: [
    param("cartID")
      .notEmpty()
      .withMessage("cartID is required")
      .isInt()
      .withMessage("cartID must be an integer"),
  ],
}; 