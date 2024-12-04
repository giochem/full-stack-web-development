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
    param("userID")
      .notEmpty()
      .withMessage("userID is required")
      .isInt()
      .withMessage("userID must be an integer"),
  ],

  updateCart: [
    body("productID")
      .notEmpty()
      .withMessage("productID is required")
      .isInt()
      .withMessage("productID must be an integer"),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],
};
