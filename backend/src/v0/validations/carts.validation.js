const { body, query, param } = require("express-validator");

module.exports = {
  getCarts: [
    query("page")
      .isInt({ min: 0 })
      .withMessage("page in query is required and >= 0"),
    query("size")
      .isInt({ min: 1 })
      .withMessage("size in query is required and >= 1"),
    query("searchText")
      .optional()
      .isString()
      .withMessage("searchText in query must be a string"),
  ],

  getCart: [
    param("userID")
      .notEmpty()
      .withMessage("userID is required")
      .isInt()
      .withMessage("userID must be an integer"),
  ],

  upsertCart: [
    body("userID")
      .notEmpty()
      .withMessage("userID is required")
      .isInt()
      .withMessage("userID must be an integer"),
    body("productItemID")
      .optional()
      .isInt()
      .withMessage("productItemID must be an integer"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],
};
